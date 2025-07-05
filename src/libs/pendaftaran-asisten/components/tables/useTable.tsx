import { Icon } from '@iconify/react'
import { Box, Button, debounce, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DialogRef } from 'src/components/shared/dialog'
import { getAllJadwal } from 'src/stores/jadwal/action'
import { ITableState } from 'src/types'
import { useAppDispatch } from 'src/utils/dispatch'

export const useTable = () => {
  const dispatch = useAppDispatch()

  const [tableState, setTableState] = useState<ITableState>({
    page: 1,
    pageSize: 10,
    search: '',
    data: null,
    isLoading: false
  })

  const dialogPendaftaranRef = useRef<DialogRef>(null)

  const [row, setRow] = useState<any>(null)

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
        field: 'action',
        headerName: 'Aksi',
        minWidth: 160,
        sortable: false,
        renderCell: (params: any) => {
          return (
            <Button
              variant='contained'
              size='small'
              onClick={() => {
                setRow(params?.row)
                dialogPendaftaranRef.current?.open()
              }}
            >
              Daftar
            </Button>
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

  // Reset page to 1 when search or pageSize changes
  useEffect(() => {
    setTableState(prev => ({ ...prev, page: 1 }))
    handleGetData(false)
  }, [tableState.search, tableState.pageSize])

  useEffect(() => {
    if (tableState.page !== 1) {
      handleGetData(true)
    }
  }, [tableState.page, tableState.pageSize])

  return {
    columns,
    tableState,
    setTableState,
    handleSearch,
    dialogPendaftaranRef,
    row
  }
}
