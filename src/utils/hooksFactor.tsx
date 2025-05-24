/* eslint-disable react-hooks/rules-of-hooks */
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

interface IReduxHooks<T> {
  action: {
    create?: (params: { data: T }) => any
    update?: (params: { data: Partial<T>; id: string }) => any
  }
  method: 'POST' | 'PUT'
  message?: {
    pending?: string
    success?: string
    error?: string
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

export const createReduxHooks = <T,>(config: IReduxHooks<T>) => {
  const { action, method, message = {} } = config

  if (method === 'POST') {
    return useCreate<T>(
      { create: action.create! },
      {
        loadingMessage: message.pending || 'Creating...',
        successMessage: message.success
      }
    )
  } else {
    return useUpdate<T>(
      { update: action.update! },
      {
        loadingMessage: message.pending || 'Updating...',
        successMessage: message.success
      }
    )
  }
}
