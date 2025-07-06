import { Icon } from '@iconify/react'
import { Box, Button, debounce, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { getPendaftaranAsistenLab, penerimaanAsistenLab } from 'src/stores/asisten-lab/action'
import { setIsRefresh } from 'src/stores/asisten-lab/slice'
import { ITableState } from 'src/types'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'

export const useListPendaftaranAsisten = () => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.asistenLab)

  const [tableState, setTableState] = useState<ITableState>({
    page: 1,
    pageSize: 10,
    search: '',
    data: null,
    isLoading: false
  })

  const debouncedSearchRef = useRef<any>(null)

  const columns: GridColDef[] = useMemo(() => {
    return [
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
              <span>{params?.row.jadwal?.matakuliah?.nama || '-'}</span>
            </Box>
          )
        }
      },
      {
        flex: 0.25,
        field: 'namaMahasiswa',
        headerName: 'Nama Mahasiswa',
        sortable: false,
        renderCell: params => {
          return <span>{params?.row?.mahasiswa?.nama || '-'}</span>
        }
      },
      {
        flex: 0.25,
        field: 'npmMahasiswa',
        headerName: 'NPM Mahasiswa',
        sortable: false,
        renderCell: params => {
          return <span>{params?.row?.mahasiswa?.npm || '-'}</span>
        }
      },
      {
        flex: 0.25,
        field: 'nilaiTeori',
        headerName: 'Nilai Teori',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'nilaiPraktikum',
        headerName: 'Nilai Praktikum',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'nilaiAkhir',
        headerName: 'Nilai Akhir',
        sortable: false
      },
      {
        flex: 0.25,
        field: 'action',
        headerName: 'Aksi',
        minWidth: 160,
        sortable: false,
        renderCell: (params: any) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant='outlined'
                color='error'
                size='small'
                onClick={() =>
                  handlePenerimaanAsisten(params?.row?.id, 'DITOLAK', 'Ditolak karena tidak memenuhi kriteria')
                }
              >
                Tolak
              </Button>
              <Button
                variant='contained'
                size='small'
                onClick={() => handlePenerimaanAsisten(params?.row?.id, 'DISETUJUI')}
              >
                Terima
              </Button>
            </Box>
          )
        }
      }
    ]
  }, [])

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
    await dispatch(getPendaftaranAsistenLab({ data: body })).then((res: any) => {
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

  const handlePenerimaanAsisten = async (id: string, action: 'DISETUJUI' | 'DITOLAK', ket?: string) => {
    toast.loading('Loading...')

    const body = {
      status: action,
      keterangan: ket
    }

    // @ts-ignore
    await dispatch(penerimaanAsistenLab({ data: body, id })).then(res => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        const errors = res?.payload?.response?.data

        toast.dismiss()
        toast.error(errors?.errors?.[0]?.message || errors?.message)

        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)

      dispatch(setIsRefresh())
    })
  }

  const handleSearch = useMemo(() => {
    const debouncedSearch = debounce((query: string) => {
      setTableState(prev => ({ ...prev, search: query }))
    }, 100)

    debouncedSearchRef.current = debouncedSearch

    return (query: any) => debouncedSearch(query)
  }, [])

  // Reset page to 1 when search or pageSize changes
  useEffect(() => {
    setTableState(prev => ({ ...prev, page: 1 }))
    handleGetData(false)
  }, [tableState.search, tableState.pageSize, isRefresh])

  useEffect(() => {
    if (tableState.page !== 1) {
      handleGetData(true)
    }
  }, [tableState.page, tableState.pageSize])

  return {
    columns,
    tableState,
    setTableState,
    handleSearch
  }
}
