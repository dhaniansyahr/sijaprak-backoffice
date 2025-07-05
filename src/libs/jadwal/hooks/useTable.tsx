import { Icon } from '@iconify/react'
import { Box, debounce, MenuItem, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import ActionTable from 'src/components/shared/action-table'
import { generateJawdal, getAllJadwal } from 'src/stores/jadwal/action'
import { setIsRefresh } from 'src/stores/jadwal/slice'
import { ITableState } from 'src/types'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'

export const useTable = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { isRefresh } = useAppSelector(state => state.jadwal)

  const [isMenuOpen, setIsMenuOpen] = useState<any>('')

  const [isGenerating, setIsGenerating] = useState(false)

  const [tableState, setTableState] = useState<ITableState>({
    page: 1,
    pageSize: 10,
    search: '',
    data: null,
    isLoading: false
  })

  const debouncedSearchRef = useRef<any>(null)

  const columns: GridColDef[] = [
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
      headerName: 'Nama Mata Kuliah',
      sortable: false,
      renderCell: params => {
        const isConflict = params?.row?.isOverride

        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isConflict && (
              <Tooltip title='Jadwal sudah ada'>
                <Icon icon='solar:danger-triangle-bold' width={20} color='#FCCF14' />
              </Tooltip>
            )}
            <span>{params?.row.matakuliah?.nama || '-'}</span>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'hari',
      headerName: 'Hari',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'shiftTime',
      headerName: 'Waktu Shift',
      sortable: false,
      renderCell: params => {
        return <span>{`${params.row.shift.startTime} - ${params.row.shift.endTime}`}</span>
      }
    },
    {
      flex: 0.25,
      field: 'dosen',
      headerName: 'Dosen Pengampu',
      sortable: false,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {params.row.dosen?.map((item: any, index: number) => (
              <span key={index}>
                {item?.nama} ({item?.nip})
              </span>
            ))}
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'aslab',
      headerName: 'Asisten Lab',
      sortable: false,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* {params.row.asisten?.map((item: any, index: number) => (
              <span key={index}>
                {item?.name} - {item?.nip}
              </span>
            ))} */}
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'Aksi',
      sortable: false,
      renderCell: params => {
        return (
          <ActionTable
            id={params?.row?.id}
            open={isMenuOpen}
            onOpen={() => setIsMenuOpen(params.row.id)}
            onClose={() => setIsMenuOpen('')}
          >
            <MenuItem
              sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
              onClick={() => {
                setIsMenuOpen('')
                router.push(`/jadwal/${params?.row?.id}/assign-assisten`)
              }}
            >
              <Icon icon='solar:user-id-broken' />
              <span>Tambahkan Asisten Lab</span>
            </MenuItem>

            <MenuItem
              sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
              onClick={() => {
                setIsMenuOpen('')
                router.push(`/jadwal/${params?.row?.id}/meetings`)
              }}
            >
              <Icon icon='mdi:calendar-outline' />
              <span>Detail Pertemuan</span>
            </MenuItem>

            <MenuItem
              sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
              onClick={() => {
                setIsMenuOpen('')
                router.push(`/jadwal/${params?.row?.id}/detail`)
              }}
            >
              <Icon icon='ph:eye' />
              <span>Detail Jadwal</span>
            </MenuItem>

            <MenuItem
              sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
              onClick={() => {
                setIsMenuOpen('')
                router.push(`/jadwal/${params?.row?.id}/absensi`)
              }}
            >
              <Icon icon='mdi:clipboard-text-outline' />
              <span>Detail Absensi</span>
            </MenuItem>
          </ActionTable>
        )
      }
    }
  ]

  const handleGetData = async (isPagination = false) => {
    setTableState(prev => ({ ...prev, isLoading: true }))

    const body = {
      params: {
        page: tableState.page,
        rows: tableState.pageSize,
        searchFilters: {
          'matakuliah.nama': tableState.search
        }
      }
    } as any

    if (!tableState.search || tableState.search === '') {
      delete body.params.searchFilters
    } else {
      body.params.searchFilters = JSON.stringify(body.params.searchFilters)
    }

    // @ts-ignore
    await dispatch(getAllJadwal({ data: body })).then((res: any) => {
      if (
        !(res.payload.content?.entries ?? []).some((obj: any) =>
          (tableState.data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
        ) &&
        isPagination
      ) {
        const _entries = [...(tableState.data?.entries ?? []), ...(res.payload.content?.entries ?? [])]
        setTableState(prev => ({ ...prev, data: Object.assign({}, res.payload.content, { entries: _entries }) }))
      } else {
        if (!res.payload.content?.entries?.length && res.payload.content?.totalPage === 1) {
          setTableState(prev => ({ ...prev, data: null }))
        } else if (!isPagination) {
          setTableState(prev => ({ ...prev, data: res.payload.content }))
        }
      }
    })

    setTableState(prev => ({ ...prev, isLoading: false }))
  }

  const handleSearch = useMemo(() => {
    const debouncedSearch = debounce((query: string) => {
      setTableState(prev => ({ ...prev, search: query }))
    }, 100)

    debouncedSearchRef.current = debouncedSearch

    return (query: any) => debouncedSearch(query)
  }, [])

  const handleGenerate = async () => {
    setIsGenerating(true)

    // @ts-ignore
    await dispatch(generateJawdal({ data: {} })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsGenerating(false)
        toast.error(res.payload?.response?.data?.message)

        return
      }

      setIsGenerating(false)
      toast.success(res.payload.message)
      dispatch(setIsRefresh())
    })
  }

  // Reset page to 1 when search or pageSize changes
  useEffect(() => {
    setTableState(prev => ({ ...prev, page: 1 }))
    handleGetData(false)
  }, [isRefresh, tableState.search, tableState.pageSize])

  useEffect(() => {
    if (tableState.page !== 1) {
      handleGetData(true)
    }
  }, [tableState.page, tableState.pageSize])

  return {
    columns,
    isGenerating,
    handleGenerate,
    tableState,
    setTableState,
    handleSearch
  }
}
