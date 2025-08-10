import { ACLData } from 'src/configs/acl'

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
  roleId: string
  userLevelId?: string // Added for ACL fetching
  userLevel: {
    id: string
    name: string
  }
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  acl: ACLData | null // Added ACL data
  aclLoading: boolean // Added ACL loading state
  fetchACL: (userLevelId: string) => Promise<void> // Added ACL fetching function
}

// ACL related types
export type ACLContextType = {
  acl: ACLData | null
  loading: boolean
  error: string | null
  fetchACL: (userLevelId: string) => Promise<void>
}
