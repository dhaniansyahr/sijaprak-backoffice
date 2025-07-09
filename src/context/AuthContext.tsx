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
import { ACLData, ACLResponse } from 'src/configs/acl'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  acl: null,
  aclLoading: false,
  fetchACL: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [acl, setAcl] = useState<ACLData | null>(defaultProvider.acl)
  const [aclLoading, setAclLoading] = useState<boolean>(defaultProvider.aclLoading)

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
    // ✅ Check if we're on client side
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('aclData')
    }
    setUser(null)
    setAcl(null)
    setLoading(false)
    setAclLoading(false)
  }, [])

  const getUserDataFromStorage = useCallback((): UserDataType | null => {
    try {
      // ✅ Check if we're on client side
      if (typeof window === 'undefined') return null

      const userData = localStorage.getItem('userData')

      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)

      return null
    }
  }, [])

  const setUserDataToStorage = useCallback((userData: UserDataType) => {
    try {
      // ✅ Check if we're on client side
      if (typeof window === 'undefined') return

      localStorage.setItem('userData', JSON.stringify(userData))
    } catch (error) {
      console.error('Error saving user data to localStorage:', error)
    }
  }, [])

  const getACLFromStorage = useCallback((): ACLData | null => {
    try {
      // ✅ Check if we're on client side
      if (typeof window === 'undefined') return null

      const aclData = localStorage.getItem('aclData')

      return aclData ? JSON.parse(aclData) : null
    } catch (error) {
      console.error('Error parsing ACL data from localStorage:', error)

      return null
    }
  }, [])

  const setACLToStorage = useCallback((aclData: ACLData) => {
    try {
      // ✅ Check if we're on client side
      if (typeof window === 'undefined') return

      localStorage.setItem('aclData', JSON.stringify(aclData))
    } catch (error) {
      console.error('Error saving ACL data to localStorage:', error)
    }
  }, [])

  // ** ACL Fetching Function
  const fetchACL = useCallback(
    async (userLevelId: string): Promise<void> => {
      try {
        setAclLoading(true)

        const response = await api.get<ACLResponse>(`/acl/${userLevelId}`)

        if (response.data.content) {
          setAcl(response.data.content)
          setACLToStorage(response.data.content)
        }
      } catch (error) {
        console.error('Error fetching ACL data:', error)
        setAcl(null)

        // Remove ACL data from storage if fetch fails
        if (typeof window !== 'undefined') {
          localStorage.removeItem('aclData')
        }
      } finally {
        setAclLoading(false)
      }
    },
    [setACLToStorage]
  )

  useEffect(() => {
    // ✅ Only run on client side
    if (typeof window === 'undefined') return

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

        // Create abort controller for cleanup with timeout
        abortControllerRef.current = new AbortController()

        // ✅ Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort()
          }
        }, 10000) // 10 second timeout

        await api.post(
          authConfig.meEndpoint,
          { token: storedToken },
          {
            signal: abortControllerRef.current.signal,
            timeout: 10000 // 10 second timeout
          }
        )

        clearTimeout(timeoutId)

        setApiDefaults(storedToken)

        const userData = getUserDataFromStorage()
        const storedAcl = getACLFromStorage()

        if (userData) {
          setUser(userData)

          if (storedAcl) {
            setAcl(storedAcl)
          }

          // Fetch fresh ACL data if user has userLevelId
          if (userData.userLevelId || userData.roleId) {
            await fetchACL(userData.userLevelId || userData.roleId)
          }
        }

        setLoading(false)
      } catch (error: any) {
        // Don't handle aborted requests
        if (error.name === 'AbortError') {
          console.log('Token verification aborted')

          return
        }

        console.error('Auth initialization error:', error)

        // ✅ On any error, clear auth data and stop loading
        clearAuthData()
      }
    }

    // ✅ Add small delay to ensure DOM is ready
    const timer = setTimeout(initAuth, 100)

    // Cleanup function
    return () => {
      clearTimeout(timer)
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

        const token = loginResponse.data.content?.token || loginResponse.data.content?.accessToken
        const refreshToken = loginResponse.data.content?.refreshToken

        const userData: UserDataType = {
          id: loginResponse.data.content?.user?.id,
          role: loginResponse.data.content?.user?.userLevel?.name,
          fullName: loginResponse.data.content?.user?.nama || loginResponse.data.content?.user?.fullName,
          noIdentitas: loginResponse.data.content?.user?.npm || loginResponse.data.content?.user?.nip,
          email: loginResponse.data.content?.user?.email || '',
          roleId: loginResponse.data.content?.user?.userLevelId,
          userLevelId: loginResponse.data.content?.user?.userLevelId
        }

        if (!token) {
          throw new Error('No token received from login')
        }

        // Store tokens
        if (typeof window !== 'undefined') {
          localStorage.setItem(authConfig.storageTokenKeyName, token)
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
          }
        }

        // Set user data
        setUser(userData)
        setUserDataToStorage(userData)

        // Second API call - verify token
        await api.post(authConfig.meEndpoint, { token })

        // Set API defaults
        setApiDefaults(token)

        // Fetch ACL data for the user
        if (userData.userLevelId) {
          await fetchACL(userData.userLevelId)
        }

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
    [router, setApiDefaults, setUserDataToStorage, clearAuthData, fetchACL]
  )

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true)

      // Clear API defaults first
      delete api.defaults.headers.common['Authorization']
      delete api.defaults.headers.common['Timezone']

      clearAuthData()

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
      logout: handleLogout,
      acl,
      aclLoading,
      fetchACL
    }),
    [user, loading, handleLogin, handleLogout, acl, aclLoading, fetchACL]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
