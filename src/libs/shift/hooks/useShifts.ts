// React Imports
import { useCallback, useEffect, useState } from 'react'

// MUI Imports
import { debounce } from '@mui/material'

// Third Party Imports
import toast from 'react-hot-toast'

// Service and Actions
import { createShift, deleteShift, getAllShift, getShift, updateShift } from 'src/stores/shift/action'
import { TCreateShift, TShift } from 'src/stores/shift/types'

// Utils import
import { useAppDispatch } from 'src/utils/dispatch'
import { TPagedList } from 'src/utils/response.utils'

export const useGetAllShifts = (refresh: boolean) => {
  const dispatch = useAppDispatch()

  const [data, setData] = useState<TPagedList<TShift> | null>(null)
  const [isLoadTable, setIsLoadTable] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<string>('')

  const getAllLaboratorium = async (isPagination = false) => {
    setIsLoadTable(true)

    const body = {
      params: {
        page: isPagination ? page : 1,
        rows: pageSize,
        searchFilters: {
          startTime: search,
          endTime: search
        }
      }
    } as any

    if (!search) delete body.params.searchFilters

    body.params.searchFilters = JSON.stringify(body.params.searchFilters)

    try {
      // @ts-ignore
      const res = await dispatch(getAllShift({ data: body }))

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
    getAllLaboratorium(false)
  }, [refresh, search])

  useEffect(() => {
    if (page !== 1) {
      getAllLaboratorium(true)
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

export const useGetShift = (id: string) => {
  const dispatch = useAppDispatch()

  const [data, setData] = useState<TShift | null>(null)

  const [isLoadData, setIsLoadData] = useState<boolean>(false)

  const handleGetShift = async () => {
    setIsLoadData(true)

    // @ts-ignore
    await dispatch(getShift({ id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoadData(false)

        return
      }

      setIsLoadData(false)
      setData(res.payload.content)
    })
  }

  useEffect(() => {
    handleGetShift()
  }, [id])

  return { data, isLoadData }
}

export const useCreateShift = () => {
  const dispatch = useAppDispatch()

  const [isCreating, setIsCreating] = useState<boolean>(false)

  const mutate = async (data: TCreateShift) => {
    setIsCreating(true)
    toast.loading('Loading...')

    const body = data

    // @ts-ignore
    await dispatch(createShift({ data: body })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res.payload.response?.data?.errors?.[0]?.message || res?.payload?.response?.data?.message)
        setIsCreating(false)

        return
      }

      setIsCreating(false)
      toast.dismiss()
      toast.success(res.payload.message)
    })
  }

  return { mutate, isCreating }
}

export const useUpdateShift = () => {
  const dispatch = useAppDispatch()

  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  const mutate = async (data: Partial<TCreateShift>, id: string) => {
    setIsUpdating(true)
    toast.loading('Loading...')

    const body = data

    // @ts-ignore
    await dispatch(updateShift({ data: body, id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res.payload.response?.data?.errors?.[0]?.message || res?.payload?.response?.data?.message)
        setIsUpdating(false)

        return
      }

      setIsUpdating(false)
      toast.dismiss()
      toast.success(res.payload.message)
    })
  }

  return { mutate, isUpdating }
}

export const useDeleteShift = () => {
  const dispatch = useAppDispatch()

  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const mutate = async (id: string) => {
    setIsDeleting(true)
    toast.loading('Loading...')

    const body = {
      params: { ids: JSON.stringify([id]) }
    }

    // @ts-ignore
    await dispatch(deleteShift({ data: body })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res.payload.response?.data?.errors?.[0]?.message || res?.payload?.response?.data?.message)
        setIsDeleting(false)

        return
      }

      setIsDeleting(false)
      toast.dismiss()
      toast.success(res.payload.message)
    })
  }

  return { mutate, isDeleting }
}
