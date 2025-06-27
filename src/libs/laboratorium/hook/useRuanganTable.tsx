import { Icon } from '@iconify/react'
import { Box, debounce, IconButton, Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { getAllRuanganLaboratorium, updateRuanganLaboratorium } from 'src/stores/laboratorium/action'
import { setIsRefresh } from 'src/stores/laboratorium/slice'
import { TRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { ITableState } from 'src/types'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'

export const useRuanganTable = () => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.ruanganLaboratorium)

  // State
  const [state, setState] = useState({
    isAdd: false,
    isEdit: false,
    isDetail: false,
    isChange: false,
    rowSelected: null as TRuanganLaboratorium | null
  })

  const [tableState, setTableState] = useState<ITableState>({
    page: 1,
    pageSize: 10,
    search: '',
    isLoading: false,
    data: null
  })

  const debouncedSearchRef = useRef<((query: string) => void) | null>(null)

  const columns: GridColDef<TRuanganLaboratorium>[] = [
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
      field: 'nama',
      headerName: 'Nama Ruangan',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'namaKepalaLab',
      headerName: 'Kepala Lab',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'nipKepalaLab',
      headerName: 'NIP',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'lokasi',
      headerName: 'Lokasi Ruangan',
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
            onChange={() => handleSoftDeleteRuangan(params.row.id, params.row)}
          />
        )
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'ACTION',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={() => {
                setState({ ...state, isDetail: true, rowSelected: params.row })
              }}
            >
              <Icon icon='ph:eye' />
            </IconButton>
            <IconButton
              onClick={() => {
                setState({ ...state, isEdit: true, rowSelected: params.row })
              }}
            >
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
            <IconButton
              onClick={() => {
                setState({ ...state, isChange: true, rowSelected: params.row })
              }}
            >
              <Icon icon='ic:round-change-circle' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

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
      const response = await dispatch(getAllRuanganLaboratorium({ data: body }))
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

  const handleSoftDeleteRuangan = async (id: string, data: any) => {
    const body: any = {
      nama: data.nama,
      lokasi: data.lokasi,
      isActive: !data.isActive
    }

    // @ts-ignore
    await dispatch(updateRuanganLaboratorium({ data: body, id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message)

        return
      }

      toast.success(res.payload.message)
      dispatch(setIsRefresh())
    })
  }

  useEffect(() => {
    setTableState(prev => ({ ...prev, page: 1 }))

    handleGetData(false)
  }, [isRefresh, tableState.search])

  useEffect(() => {
    if (tableState.page > 1) {
      handleGetData(true)
    }
  }, [tableState.page, tableState.pageSize])

  return {
    state,
    setState,
    columns,
    tableState,
    setTableState,
    handleSearch
  }
}
