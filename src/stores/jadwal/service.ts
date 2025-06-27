import { createCrudHooks } from 'src/utils/hooksFactor'
import { createJadwal, deleteJadwal, getAllJadwal, getJadwal, updateJadwal } from './action'
import { TDetailJadwal, TJadwal, TJadwalPayload } from './types'

const jadwalHooks = createCrudHooks<TJadwal & TDetailJadwal, TJadwalPayload>({
  actions: {
    getAll: getAllJadwal,
    getById: getJadwal,
    create: createJadwal,
    update: updateJadwal,
    delete: deleteJadwal
  },
  searchFields: ['nama'],
  defaultPageSize: 10,
  messages: {
    creating: 'Creating ...',
    updating: 'Updating ...',
    deleting: 'Deleting ...',
    createSuccess: 'Jadwal berhasil dibuat!',
    updateSuccess: 'Jadwal berhasil diupdate!',
    deleteSuccess: 'Jadwal berhasil dihapus!'
  }
})

export const useGetAllJadwal = jadwalHooks.useGetAll
export const useGetJadwal = jadwalHooks.useGetById
export const useCreateJadwal = jadwalHooks.useCreate
export const useUpdateJadwal = jadwalHooks.useUpdate
export const useDeleteJadwal = jadwalHooks.useDelete
