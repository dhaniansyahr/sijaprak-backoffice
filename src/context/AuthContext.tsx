// ** React Imports
import { ReactNode, createContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import api from 'src/service/api'
import { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  // ** Refs for cleanup
  const initAuthRef = useRef<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // ** Memoized helper functions
  const setApiDefaults = useCallback((token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    api.defaults.headers.common['Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone
  }, [])

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('userData')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    setUser(null)
    setLoading(false)
  }, [])

  const getUserDataFromStorage = useCallback((): UserDataType | null => {
    try {
      const userData = localStorage.getItem('userData')

      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)

      return null
    }
  }, [])

  const setUserDataToStorage = useCallback((userData: UserDataType) => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData))
    } catch (error) {
      console.error('Error saving user data to localStorage:', error)
    }
  }, [])

  useEffect(() => {
    // Prevent multiple initialization calls
    if (initAuthRef.current) return

    const initAuth = async (): Promise<void> => {
      initAuthRef.current = true

      try {
        const storedToken = localStorage.getItem(authConfig.storageTokenKeyName)

        if (!storedToken) {
          setLoading(false)

          return
        }

        setLoading(true)

        // Create abort controller for cleanup
        abortControllerRef.current = new AbortController()

        const response = await api.post(
          authConfig.meEndpoint,
          { token: storedToken },
          { signal: abortControllerRef.current.signal }
        )

        console.log('Response Verify Token:', response)

        setApiDefaults(storedToken)

        const userData = getUserDataFromStorage()
        if (userData) {
          setUser(userData)
        }

        setLoading(false)
      } catch (error: any) {
        // Don't handle aborted requests
        if (error.name === 'AbortError') return

        console.error('Auth initialization error:', error)
        clearAuthData()
      }
    }

    initAuth()

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, []) // Remove router dependency to prevent unnecessary re-runs

  const handleLogin = useCallback(
    async (params: LoginParams, errorCallback?: ErrCallbackType) => {
      try {
        // First API call - login
        const loginResponse = await api.post(authConfig.loginEndpoint, params)

        const token = loginResponse.data.content?.token
        const userData = { ...loginResponse.data.content?.user, role: 'ADMIN' }

        if (!token) {
          throw new Error('No token received from login')
        }

        // Store token
        localStorage.setItem(authConfig.storageTokenKeyName, token)

        // Set user data
        setUser(userData)
        setUserDataToStorage(userData)

        // Second API call - verify token
        await api.post(authConfig.meEndpoint, { token })

        // Set API defaults
        setApiDefaults(token)

        // Handle redirect
        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/dashboard'

        // Use router for navigation instead of window.location
        await router.push(redirectURL as string)
      } catch (error: any) {
        clearAuthData()

        if (errorCallback) {
          errorCallback(error)
        }
      }
    },
    [router, setApiDefaults, setUserDataToStorage, clearAuthData]
  )

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true)
      clearAuthData()

      // Clear API defaults
      delete api.defaults.headers.common['Authorization']
      delete api.defaults.headers.common['Timezone']

      await router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }, [router, clearAuthData])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      setUser,
      setLoading,
      login: handleLogin,
      logout: handleLogout
    }),
    [user, loading, handleLogin, handleLogout]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
