import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { getAllRuanganLaboratorium, getRuanganLaboratorium } from 'src/stores/laboratorium/action'
import { TDetailRuanganLaboratorium, TRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { TPagedList } from 'src/utils/response.utils'
import { debounce } from '@mui/material'
import toast from 'react-hot-toast'

const useAppDispatch = () => useDispatch<AppDispatch>()

export const useGetAllRuanganLaboratorium = (isRefresh: boolean) => {
  const dispatch = useAppDispatch()

  const [data, setData] = useState<TPagedList<TRuanganLaboratorium> | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<string>('')

  const getAllLaboratorium = async (isPagination = false) => {
    setIsLoading(true)

    const body = {
      params: {
        page: isPagination ? page : 1,
        rows: pageSize,
        searchFilters: {
          namaKepala: search
        }
      }
    } as any

    if (!search) {
      delete body.params.searchFilters['namaKepala']
    }

    body.params.searchFilters = JSON.stringify(body.params.searchFilters)

    try {
      // @ts-ignore
      const res = await dispatch(getAllRuanganLaboratorium({ data: body }))

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
      setIsLoading(false)
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
  }, [isRefresh, search])

  useEffect(() => {
    if (page !== 1) {
      getAllLaboratorium(true)
    }
  }, [isRefresh, page, pageSize])

  return {
    data,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    handleSearch
  }
}

export const useGetRuanganLaboratorium = (id: string, open?: boolean) => {
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<TDetailRuanganLaboratorium | null>(null)

  const handleGetRuanganLaboratorium = async () => {
    setLoading(true)

    // @ts-ignore
    await dispatch(getRuanganLaboratorium({ id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setLoading(false)
        // toast.error(res.payload?.response?.data?.errors?.[0]?.message || res.payload?.response?.data?.message)

        return
      }

      setLoading(false)
      setData(res.payload?.content)
    })
  }

  useEffect(() => {
    handleGetRuanganLaboratorium()
  }, [open])

  return {
    data,
    loading
  }
}
