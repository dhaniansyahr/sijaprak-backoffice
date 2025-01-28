// ** React Imports
import { ReactNode, createContext, useEffect, useState } from 'react'

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

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await api
          .post(authConfig.meEndpoint, {
            token: `${storedToken}`
          })
          .then(async () => {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
            api.defaults.headers.common['Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone

            setLoading(false)
            setUser(JSON.parse(localStorage.getItem('userData')!))

            // setUser({ ...response.data.content?.payload })
            // localStorage.setItem('userData', JSON.stringify(response.data.content?.payload))
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [router])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    api
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.content?.token)

        setUser({ ...response.data.content?.user, role: 'ADMIN' })
        await window.localStorage.setItem('userData', JSON.stringify({ ...response.data.content?.user, role: 'ADMIN' }))
      })
      .then(() => {
        api
          .post(authConfig.meEndpoint, {
            token: `${window.localStorage.getItem(authConfig.storageTokenKeyName)}`!
          })
          .then(async () => {
            const returnUrl = router.query.returnUrl

            api.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem(
              authConfig.storageTokenKeyName
            )}`
            api.defaults.headers.common['Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone

            // setUser({ ...response.data.content?.payload })
            // localStorage.setItem('userData', JSON.stringify(response.data.content?.payload))

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

            window.location.href = redirectURL as string
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
