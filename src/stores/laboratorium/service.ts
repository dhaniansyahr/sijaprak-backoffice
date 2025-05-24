import { createCrudHooks } from 'src/utils/hooksFactor'
import { TCreateRuanganLaboratorium, TDetailRuanganLaboratorium, TRuanganLaboratorium } from './types'
import {
  createRuanganLaboratorium,
  deleteRuanganLaboratorium,
  getAllRuanganLaboratorium,
  getRuanganLaboratorium,
  updateRuanganLaboratorium
} from './action'

const ruanganHooks = createCrudHooks<TRuanganLaboratorium & TDetailRuanganLaboratorium, TCreateRuanganLaboratorium>({
  actions: {
    getAll: getAllRuanganLaboratorium,
    getById: getRuanganLaboratorium,
    create: createRuanganLaboratorium,
    update: updateRuanganLaboratorium,
    delete: deleteRuanganLaboratorium
  },
  searchFields: ['nama'],
  defaultPageSize: 10,
  messages: {
    creating: 'Creating ...',
    updating: 'Updating ...',
    deleting: 'Deleting ...',
    createSuccess: 'Ruangan Laboratorium berhasil dibuat!',
    updateSuccess: 'Ruangan Laboratorium berhasil diupdate!',
    deleteSuccess: 'Ruangan Laboratorium berhasil dihapus!'
  }
})

export const useGetAllRuangan = ruanganHooks.useGetAll
export const useGetRuangan = ruanganHooks.useGetById
export const useCreateRuangan = ruanganHooks.useCreate
export const useUpdateRuangan = ruanganHooks.useUpdate
export const useDeleteRuangan = ruanganHooks.useDelete
