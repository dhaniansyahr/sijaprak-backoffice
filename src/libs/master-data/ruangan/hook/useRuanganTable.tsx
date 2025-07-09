import { Box, IconButton, Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { deleteRuanganLaboratorium, getAllRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'
import { ITableState } from 'src/types'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import { EyeIcon, EditIcon, ChangeIcon } from 'src/components/shared/icons'
import Can, { AbilityContext } from 'src/layouts/components/acl/Can'
import { useAbility } from '@casl/react'
import { DialogRef } from 'src/components/shared/dialog'

// Memoized action buttons component to prevent re-renders
const ActionButtons = ({
  row,
  onDetail,
  onEdit,
  onChange
}: {
  row: any
  onDetail: (row: any) => void
  onEdit: (row: any) => void
  onChange: (row: any) => void
}) => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    <Can I={'read'} a={'RUANGAN'}>
      <IconButton onClick={() => onDetail(row)} size='small'>
        <EyeIcon />
      </IconButton>
    </Can>

    <Can I={'update'} a={'RUANGAN'}>
      <IconButton onClick={() => onEdit(row)} size='small'>
        <EditIcon />
      </IconButton>
    </Can>

    <Can I={'create'} a={'HISTORY_KEPALA_LAB'}>
      <IconButton onClick={() => onChange(row)} size='small'>
        <ChangeIcon />
      </IconButton>
    </Can>
  </Box>
)

export const useRuanganTable = () => {
  const dispatch = useAppDispatch()
  const ability = useAbility(AbilityContext)

  const { isRefresh } = useAppSelector(state => state.ruanganLaboratorium)

  // State
  const [tableState, setTableState] = useState<ITableState>({
    page: 1,
    pageSize: 10,
    search: '',
    isLoading: false,
    data: null
  })

  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null)

  const [row, setRow] = useState<any>(null)
  const addRef = useRef<DialogRef>(null)
  const editRef = useRef<DialogRef>(null)
  const detailRef = useRef<DialogRef>(null)
  const changeRef = useRef<DialogRef>(null)

  const handleSoftDeleteRuangan = useCallback(
    async (id: string) => {
      const toastId = toast.loading('Loading...')

      const body = {
        params: {
          ids: JSON.stringify([id])
        }
      }

      try {
        // @ts-ignore
        const res = await dispatch(deleteRuanganLaboratorium({ data: body, id }))

        if (res.meta.requestStatus !== 'fulfilled') {
          toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message, {
            id: toastId
          })

          return
        }

        toast.success(res.payload.message, { id: toastId })
        dispatch(setIsRefresh())
      } catch (error) {
        toast.error('Gagal menghapus data', { id: toastId })
      }
    },
    [dispatch]
  )

  const isActionAllowed = useMemo(() => {
    return (
      ability?.can('read', 'RUANGAN') ||
      ability?.can('update', 'RUANGAN') ||
      ability?.can('create', 'HISTORY_KEPALA_LAB')
    )
  }, [ability])

  // Memoized columns definition
  const columns: GridColDef<any>[] = useMemo(
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
        renderCell: params => (
          <Can I={'delete'} a={'RUANGAN'}>
            <Switch
              checked={params.row.isActive}
              color='success'
              onChange={() => handleSoftDeleteRuangan(params.row.id)}
              size='small'
            />
          </Can>
        )
      }
    ],
    [handleSoftDeleteRuangan]
  )

  if (isActionAllowed) {
    columns.push({
      flex: 0.25,
      field: 'action',
      headerName: 'ACTION',
      minWidth: 160,
      sortable: false,
      renderCell: params => (
        <ActionButtons
          row={params.row}
          onDetail={() => {
            detailRef.current?.open()
            setRow(params.row)
          }}
          onEdit={() => {
            editRef.current?.open()
            setRow(params.row)
          }}
          onChange={() => {
            changeRef.current?.open()
            setRow(params.row)
          }}
        />
      )
    })
  }

  const handleGetData = useCallback(
    async (isPagination = false) => {
      setTableState(prev => ({ ...prev, isLoading: true }))

      const body = {
        params: {
          page: isPagination ? tableState.page : 1,
          rows: tableState.pageSize,
          ...(tableState.search && {
            searchFilters: JSON.stringify({ nama: tableState.search })
          })
        }
      }

      try {
        const response = await dispatch(getAllRuanganLaboratorium({ data: body }))
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
        toast.error('Gagal mengambil data')
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
  }, [isRefresh, tableState.search])

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
    row,
    addRef,
    editRef,
    detailRef,
    changeRef,
    columns,
    tableState,
    setTableState,
    handleSearch
  }
}
