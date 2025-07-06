export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  identity: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: string
  role: string
  email: string
  fullName: string
  avatar?: string | null
  noIdentitas: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
