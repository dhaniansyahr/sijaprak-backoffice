import { debounce, Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { deleteShift, getAllShift, updateShift } from 'src/stores/master-data/shift/action'
import { setIsRefresh } from 'src/stores/master-data/shift/slice'
import { TShift } from 'src/stores/shift/types'
import { ITableState } from 'src/types'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'

export const useShiftTable = () => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.shift)

  const [tableState, setTableState] = useState<ITableState>({
    page: 1,
    pageSize: 10,
    search: '',
    isLoading: false,
    data: null
  })

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)

  const debouncedSearchRef = useRef<any>(null)

  const columns: GridColDef<TShift>[] = useMemo(
    () => [
      {
        flex: 0.25,
        field: 'no',
        headerName: 'No',
        maxWidth: 80,
        sortable: false,
        renderCell: params => {
          return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
        }
      },
      {
        flex: 0.25,
        field: 'startTime',
        headerName: 'Start Time',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'endTime',
        headerName: 'End Time',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'isActive',
        headerName: 'Is Active',
        minWidth: 160,
        sortable: false,
        renderCell: params => {
          return (
            <Switch
              checked={params.row.isActive}
              color='success'
              onChange={e => handleActive(params?.row?.id)}
              disabled={tableState.isLoading}
            />
          )
        }
      }
    ],
    [tableState.isLoading, isRefresh]
  )

  const handleGetData = async (isPagination = false) => {
    setTableState(prev => ({ ...prev, isLoading: true }))

    const body = {
      params: {
        page: isPagination ? tableState.page : 1,
        rows: tableState.pageSize,
        searchFilters: {
          nama: tableState.search
        }
      }
    } as any

    if (!tableState.search || tableState.search === '') delete body.params.searchFilters

    body.params.searchFilters = JSON.stringify(body.params.searchFilters)

    try {
      const response = await dispatch(getAllShift({ data: body }))
      const newData = response.payload.content

      if (
        isPagination &&
        !(newData?.entries ?? []).some((obj: any) =>
          (tableState.data?.entries ?? []).some((existingObj: any) => obj.id === existingObj.id)
        )
      ) {
        // Append new entries to existing data
        const combinedEntries = [...(tableState.data?.entries ?? []), ...(newData?.entries ?? [])]
        setTableState(prev => ({
          ...prev,
          data: { ...newData, entries: combinedEntries }
        }))
      } else {
        // Replace data entirely
        if (!newData?.entries?.length && newData?.totalPage === 1) {
          setTableState(prev => ({ ...prev, data: null }))
        } else if (!isPagination) {
          setTableState(prev => ({ ...prev, data: newData }))
        }
      }
    } catch (error) {
      toast.error('Gagal mengambil data')
    }

    setTableState(prev => ({ ...prev, isLoading: false }))
  }

  const handleSearch = useMemo(() => {
    const debouncedSearch = debounce((query: string) => {
      setTableState(prev => ({ ...prev, search: query }))
    }, 100)

    debouncedSearchRef.current = debouncedSearch

    return (query: any) => debouncedSearch(query)
  }, [])

  const handleActive = async (id: string) => {
    toast.loading('Loading...')

    const body: any = {
      params: {
        ids: JSON.stringify([id])
      }
    }

    // @ts-ignore
    await dispatch(deleteShift({ data: body })).then(res => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.message)

        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)
      dispatch(setIsRefresh())
    })
  }

  useEffect(() => {
    setTableState(prev => ({ ...prev, page: 1 }))

    handleGetData(false)
  }, [isRefresh, tableState.search])

  useEffect(() => {
    if (tableState.page !== 1) {
      handleGetData(true)
    }
  }, [tableState.page, tableState.pageSize])

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    columns,
    tableState,
    setTableState,
    handleSearch
  }
}
