import Yup from 'yup'

export type TRuanganLaboratorium = {
  id: string
  nama: string
  lokasi: string
  namaKepalaLab: string | null
  nipKepalaLab: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
  histroyKepalaLabId: string
}

export type TDetailRuanganLaboratorium = {
  id: string
  nama: string
  lokasi: string
  namaKepalaLab: string
  nipKepalaLab: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  histroyKepalaLabId: string
  historyKepalaLab: {
    nama: string
    nip: string
  }
  historyLabs: THistoryLabs[] | []
}

export type THistoryLabs = {
  id: string
  nama: string
  nip: string
  ruanganLabId: string
  createdAt: string
  updatedAt: string
}

export type TCreateRuanganLaboratorium = {
  nama: string
  lokasi: string
}

export type TAssignKepalaLab = {
  nama: string
  nip: string
}

export const ruanganLaboratoriumSchema = Yup.object({
  nama: Yup.string().required('Nama Ruangan Laboratorium is Required!'),
  lokasi: Yup.string().required('Lokasi Ruangan Laboratorium is Required!')
}).required()
