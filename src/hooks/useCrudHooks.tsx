import { useCallback, useEffect, useState } from 'react'

import { debounce } from '@mui/material'
import toast from 'react-hot-toast'

import { useAppDispatch } from 'src/utils/dispatch'
import { TPagedList } from 'src/utils/response.utils'

// Generic types
interface CrudActions<T, TCreate> {
  getAll: (params: any) => any
  getById: (params: { id: string }) => any
  create: (params: { data: TCreate }) => any
  update: (params: { data: Partial<TCreate>; id: string }) => any
  delete: (params: { data: any }) => any
}

interface SearchFilters {
  [key: string]: string
}

interface UseGetAllOptions {
  searchFields?: string[]
  defaultPageSize?: number
  additionalParams?: Record<string, any>
}

// Generic useGetAll hook
export const useGetAll = <T,>(
  actions: Pick<CrudActions<T, any>, 'getAll'>,
  refresh: boolean,
  options: UseGetAllOptions = {}
) => {
  const dispatch = useAppDispatch()
  const { searchFields = [], defaultPageSize = 10, additionalParams } = options

  const [data, setData] = useState<TPagedList<T> | null>(null)
  const [isLoadTable, setIsLoadTable] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(defaultPageSize)
  const [search, setSearch] = useState<string>('')

  const getAllData = async (isPagination = false) => {
    setIsLoadTable(true)

    const body = {
      params: {
        page: isPagination ? page : 1,
        rows: pageSize,
        ...additionalParams,
        ...(search &&
          searchFields.length > 0 && {
            searchFilters: searchFields.reduce((acc, field) => {
              acc[field] = search

              return acc
            }, {} as SearchFilters)
          })
      }
    } as any

    if (body.params.searchFilters) {
      body.params.searchFilters = JSON.stringify(body.params.searchFilters)
    }

    try {
      // @ts-ignore
      const res = await dispatch(actions.getAll({ data: body }))

      if (
        !(res?.payload?.content?.entries ?? []).some((obj: any) =>
          (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
        ) &&
        isPagination
      ) {
        const _entries = [...(data?.entries ?? []), ...(res?.payload?.content?.entries ?? [])]
        setData(Object.assign({}, res?.payload?.content, { entries: _entries }))
      } else {
        if (!res?.payload?.content?.entries?.length && res?.payload?.content?.totalPage === 1) {
          setData(null)
        } else if (!isPagination) {
          setData(res?.payload?.content)
        }
      }
    } finally {
      setIsLoadTable(false)
    }
  }

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  useEffect(() => {
    setPage(1)
    getAllData(false)
  }, [refresh, search])

  useEffect(() => {
    if (page !== 1) {
      getAllData(true)
    }
  }, [refresh, page, pageSize])

  return {
    data,
    isLoadTable,
    page,
    pageSize,
    setPage,
    setPageSize,
    handleSearch
  }
}

// Generic useGetById hook
export const useGetById = <T,>(actions: Pick<CrudActions<T, any>, 'getById'>, id: string) => {
  const dispatch = useAppDispatch()
  const [data, setData] = useState<T | null>(null)
  const [isLoadData, setIsLoadData] = useState<boolean>(false)

  const handleGetData = async () => {
    setIsLoadData(true)

    // @ts-ignore
    await dispatch(actions.getById({ id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoadData(false)

        return
      }

      setIsLoadData(false)
      setData(res.payload.content)
    })
  }

  useEffect(() => {
    if (id) {
      handleGetData()
    }
  }, [id])

  return { data, isLoadData }
}

// Generic useCreate hook
export const useCreate = <TCreate,>(
  actions: Pick<CrudActions<any, TCreate>, 'create'>,
  options: { loadingMessage?: string; successMessage?: string } = {}
) => {
  const dispatch = useAppDispatch()
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const { loadingMessage = 'Loading...', successMessage } = options

  const mutate = async (data: TCreate): Promise<any> => {
    setIsCreating(true)
    toast.loading(loadingMessage)

    // @ts-ignore
    await dispatch(actions.create({ data })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsCreating(false)
        toast.dismiss()
        toast.error(res.payload.response?.data?.errors?.[0]?.message || res?.payload?.response?.data?.message)

        return
      }

      setIsCreating(false)
      toast.dismiss()
      toast.success(successMessage || res.payload.message)
    })
  }

  return { mutate, isCreating }
}

// Generic useUpdate hook
export const useUpdate = <TUpdate,>(
  actions: Pick<CrudActions<any, TUpdate>, 'update'>,
  options: { loadingMessage?: string; successMessage?: string } = {}
) => {
  const dispatch = useAppDispatch()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { loadingMessage = 'Loading...', successMessage } = options

  const mutate = async (data: Partial<TUpdate>, id: string): Promise<any> => {
    setIsUpdating(true)
    toast.loading(loadingMessage)

    // @ts-ignore
    await dispatch(actions.update({ data, id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res.payload.response?.data?.errors?.[0]?.message || res?.payload?.response?.data?.message)
        setIsUpdating(false)

        return
      }

      setIsUpdating(false)

      toast.dismiss()
      toast.success(successMessage || res.payload.message)
    })
  }

  return { mutate, isUpdating }
}

// Generic useDelete hook
export const useDelete = <T,>(
  actions: Pick<CrudActions<T, any>, 'delete'>,
  options: {
    loadingMessage?: string
    successMessage?: string
    deleteMultiple?: boolean
  } = {}
) => {
  const dispatch = useAppDispatch()
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const { loadingMessage = 'Loading...', successMessage, deleteMultiple = false } = options

  const mutate = async (id: string | string[]) => {
    setIsDeleting(true)
    toast.loading(loadingMessage)

    const ids = Array.isArray(id) ? id : [id]
    const body = {
      params: { ids: JSON.stringify(ids) }
    }

    // @ts-ignore
    await dispatch(actions.delete({ data: body })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res.payload.response?.data?.errors?.[0]?.message || res?.payload?.response?.data?.message)
        setIsDeleting(false)

        return
      }

      setIsDeleting(false)
      toast.dismiss()
      toast.success(successMessage || res.payload.message)
    })
  }

  return { mutate, isDeleting }
}
