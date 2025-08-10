import { Box, Card, CardContent, CardHeader, debounce, TextField } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import HeaderPage from 'src/components/shared/header-page'
import DialogPendaftaran from '../dialogs/DialogPendaftaran'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import { getAllJadwalForPendaftaran } from 'src/stores/asisten-lab/action'
import DataTable from 'src/components/shared/table'
import { createColumns } from './column'
import { IDialogRef } from 'src/components/shared/dialog'

export default function TablePendaftaranAsisten() {
  const [search, setSearch] = useState('')
  const [id, setId] = useState('')

  const dialogPendaftaranRef = useRef<IDialogRef>(null)

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  const columns = createColumns({
    onRegis: (id: string) => {
      setId(id)
      dialogPendaftaranRef.current?.open()
    }
  })

  return (
    <Card>
      <HeaderPage title='Pendaftaran Asisten Laboratorium' />

      <CardHeader
        title={
          <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              size='small'
              placeholder='Cari Nama'
              onChange={(e: any) => handleSearch(e.target.value)}
              sx={{ minWidth: 200 }}
              fullWidth
            />
          </Box>
        }
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'start', md: 'center' },
          borderBottom: '1px solid #f4f4f4'
        }}
      />
      <CardContent style={{ paddingInline: '10px' }}>
        <PendaftaranEntries search={search} columns={columns} />
      </CardContent>

      <DialogPendaftaran dialogRef={dialogPendaftaranRef} jadwalId={id} />
    </Card>
  )
}

const PendaftaranEntries = memo(({ search, columns }: { search: string; columns: GridColDef[] }) => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.asistenLab)

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(10)

  const handleGetData = async (isPagination = false) => {
    setIsLoading(true)

    const body: any = {
      params: {
        page: isPagination ? page : 1,
        rows: rows,
        searchFilters: {
          'matakuliah.nama': search
        }
      }
    }

    if (!search || search === '') delete body.params.searchFilters

    // @ts-ignore
    await dispatch(getAllJadwalForPendaftaran({ data: body }))
      .then((res: any) => {
        if (
          !(res.payload.content?.entries ?? []).some((obj: any) =>
            (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
          ) &&
          isPagination
        ) {
          const _entries = [...(data?.entries ?? []), ...(res.payload.content?.entries ?? [])]
          setData(Object.assign({}, res.payload.content, { entries: _entries }))
        } else {
          if (!res.payload.content?.entries?.length && res.payload.content?.totalPage === 1) {
            setData(null)
          } else if (!isPagination) {
            setData(res.payload.content)
          }
        }
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    setPage(1)
    handleGetData(false)
  }, [isRefresh, search])

  useEffect(() => {
    if (page !== 1) {
      handleGetData(true)
    }
  }, [page, rows])

  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={{
        page: page,
        rows: rows,
        setPage: setPage,
        setRows: setRows
      }}
      isLoading={isLoading}
    />
  )
})
