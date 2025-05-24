import { createShift, deleteShift, getAllShift, getShift, updateShift } from 'src/stores/shift/action'
import { TCreateShift, TShift } from 'src/stores/shift/types'
import { createCrudHooks } from 'src/utils/hooksFactor'

export const shiftHooks = createCrudHooks<TShift, TCreateShift>({
  actions: {
    getAll: getAllShift,
    getById: getShift,
    create: createShift,
    update: updateShift,
    delete: deleteShift
  },
  searchFields: ['startTime', 'endTime'],
  defaultPageSize: 10,
  messages: {
    creating: 'Creating shift...',
    updating: 'Updating shift...',
    deleting: 'Deleting shift...',
    createSuccess: 'Shift berhasil dibuat!',
    updateSuccess: 'Shift berhasil diupdate!',
    deleteSuccess: 'Shift berhasil dihapus!'
  }
})

export const useGetAllShifts = shiftHooks.useGetAll
export const useGetShift = shiftHooks.useGetById
export const useCreateShift = shiftHooks.useCreate
export const useUpdateShift = shiftHooks.useUpdate
export const useDeleteShift = shiftHooks.useDelete
