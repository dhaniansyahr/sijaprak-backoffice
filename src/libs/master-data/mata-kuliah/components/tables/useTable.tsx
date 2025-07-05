import { Box, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ITableState } from 'src/types'
import { useAppDispatch } from 'src/utils/dispatch'
import { EyeIcon } from 'src/components/shared/icons'
import { getAllMataKuliah } from 'src/stores/jadwal/action'

// Memoized action buttons component to prevent re-renders
const ActionButtons = ({ row, onDetail }: { row: any; onDetail: (row: any) => void }) => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    <IconButton onClick={() => onDetail(row)} size='small'>
      <EyeIcon />
    </IconButton>
  </Box>
)

export const useTable = () => {
  const dispatch = useAppDispatch()

  // State
  const [state, setState] = useState({
    isAdd: false,
    isEdit: false,
    isDetail: false,
    isChange: false,
    rowSelected: null
  })

  const [tableState, setTableState] = useState<ITableState>({
    page: 1,
    pageSize: 100,
    search: '',
    isLoading: false,
    data: null
  })

  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null)

  // Memoized action handlers
  const handleDetail = useCallback((row: any) => {
    setState(prev => ({ ...prev, isDetail: true, rowSelected: row }))
  }, [])

  // Memoized columns definition
  const columns: GridColDef[] = useMemo(
    () => [
      {
        flex: 0.25,
        field: 'no',
        headerName: 'No',
        maxWidth: 80,
        sortable: false,
        renderCell: params => <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      },
      {
        flex: 0.25,
        field: 'kode',
        headerName: 'Kode',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'nama',
        headerName: 'Nama',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'sks',
        headerName: 'SKS',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'semester',
        headerName: 'Semester',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'bidangMinat',
        headerName: 'Bidang Minat',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'action',
        headerName: 'ACTION',
        minWidth: 160,
        sortable: false,
        renderCell: params => <ActionButtons row={params.row} onDetail={handleDetail} />
      }
    ],
    [handleDetail]
  )

  const handleGetData = useCallback(
    async (isPagination = false) => {
      setTableState(prev => ({ ...prev, isLoading: true }))

      const body = {
        params: {
          page: isPagination ? tableState.page : 1,
          rows: tableState.pageSize,
          ...(tableState.search && {
            searchFilters: JSON.stringify({ nama: tableState.search, kode: tableState.search })
          })
        }
      }

      try {
        const response = await dispatch(getAllMataKuliah({ data: body }))
        const newData = response.payload.content

        if (isPagination && newData?.entries?.length) {
          // Check if new data doesn't duplicate existing entries
          const existingIds = new Set((tableState.data?.entries ?? []).map((obj: any) => obj.id))
          const uniqueNewEntries = (newData.entries ?? []).filter((obj: any) => !existingIds.has(obj.id))

          if (uniqueNewEntries.length > 0) {
            setTableState(prev => ({
              ...prev,
              data: {
                ...newData,
                entries: [...(prev.data?.entries ?? []), ...uniqueNewEntries]
              },
              isLoading: false
            }))

            return
          }
        }

        // Replace data entirely
        setTableState(prev => ({
          ...prev,
          data: newData?.entries?.length || newData?.totalPage !== 1 ? newData : null,
          isLoading: false
        }))
      } catch (error) {
        setTableState(prev => ({ ...prev, isLoading: false }))
      }
    },
    [dispatch, tableState.page, tableState.pageSize, tableState.search, tableState.data]
  )

  const handleSearch = useCallback((query: string) => {
    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current)
    }

    debouncedSearchRef.current = setTimeout(() => {
      setTableState(prev => ({ ...prev, search: query, page: 1 }))
    }, 300)
  }, [])

  // Effects
  useEffect(() => {
    handleGetData(false)
  }, [tableState.search])

  useEffect(() => {
    if (tableState.page > 1) {
      handleGetData(true)
    }
  }, [tableState.page, tableState.pageSize])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debouncedSearchRef.current) {
        clearTimeout(debouncedSearchRef.current)
      }
    }
  }, [])

  return {
    state,
    setState,
    columns,
    tableState,
    setTableState,
    handleSearch
  }
}
