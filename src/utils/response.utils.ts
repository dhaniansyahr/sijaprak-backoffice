export interface TServiceResponse<T> {
  data?: T
  err?: IServiceError
  status: boolean
}

interface IServiceError {
  message: string
  code: number
}

export type TResponse<T> = {
  content: T | {}
  message: string
  errors: []
}

export type TPagedListResponse<T> = TResponse<{
  entries: T[]
  totalData: number
  totalPage: number
}>

export type TPagedList<T> = {
  entries: T[]
  totalData: number
  totalPage: number
}

export interface IDialogProps {
  open: boolean
  onClose: () => void
  values?: any
}
