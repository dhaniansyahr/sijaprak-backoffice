import Yup from 'yup'

export type TShift = {
  id: string
  startTime: string
  endTime: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type TCreateShift = {
  startTime: string | null
  endTime: string | null
}

export const schemaShift = Yup.object({
  startTime: Yup.string().required('Mohon mengisikan waktu dimulai!'),
  endTime: Yup.string().required('Mohon mengisikan waktu berakhir!')
}).required()
