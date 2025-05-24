import { useCreate, useDelete, useGetAll, useGetById, useUpdate } from 'src/hooks/useCrudHooks'

interface HookFactoryConfig<T, TCreate> {
  actions: {
    getAll: (params: any) => any
    getById: (params: { id: string }) => any
    create: (params: { data: TCreate }) => any
    update: (params: { data: Partial<TCreate>; id: string }) => any
    delete: (params: { data: any }) => any
  }
  searchFields?: string[]
  defaultPageSize?: number
  messages?: {
    creating?: string
    updating?: string
    deleting?: string
    createSuccess?: string
    updateSuccess?: string
    deleteSuccess?: string
  }
}

// Hook factory function
export const createCrudHooks = <T, TCreate>(config: HookFactoryConfig<T, TCreate>) => {
  const { actions, searchFields = [], defaultPageSize = 10, messages = {} } = config

  return {
    useGetAll: (refresh: boolean) =>
      useGetAll<T>({ getAll: actions.getAll }, refresh, { searchFields, defaultPageSize }),

    useGetById: (id: string) => useGetById<T>({ getById: actions.getById }, id),

    useCreate: () =>
      useCreate<TCreate>(
        { create: actions.create },
        {
          loadingMessage: messages.creating || 'Creating...',
          successMessage: messages.createSuccess
        }
      ),

    useUpdate: () =>
      useUpdate<TCreate>(
        { update: actions.update },
        {
          loadingMessage: messages.updating || 'Updating...',
          successMessage: messages.updateSuccess
        }
      ),

    useDelete: () =>
      useDelete<T>(
        { delete: actions.delete },
        {
          loadingMessage: messages.deleting || 'Deleting...',
          successMessage: messages.deleteSuccess
        }
      )
  }
}
