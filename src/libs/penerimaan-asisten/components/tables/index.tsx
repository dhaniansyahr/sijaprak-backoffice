import { Box, Card, CardContent, CardHeader, debounce, TextField } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import HeaderPage from 'src/components/shared/header-page'
import DialogRejection from '../dialogs/DialogRejection'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { IDialogRef } from 'src/components/shared/dialog'
import { createColumns } from './column'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import { getPendaftaranAsistenLab, penerimaanAsistenLab } from 'src/stores/asisten-lab/action'
import DataTable from 'src/components/shared/table'
import toast from 'react-hot-toast'
import { setIsRefresh } from 'src/stores/asisten-lab/slice'

export default function TablePenerimaanAsistenLab() {
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')
  const [id, setId] = useState('')

  const dialogRejectionRef = useRef<IDialogRef>(null)

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  const onApprove = async (id: string) => {
    toast.loading('Loading...')

    const body = {
      status: 'DISETUJUI'
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

  const columns = createColumns({
    onReject: (id: string) => {
      setId(id)
      dialogRejectionRef.current?.open()
    },
    onApprove: (id: string) => onApprove(id)
  })

  return (
    <Card>
      <HeaderPage title='List Pendaftaran Asisten Laboratorium' />

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
        <PenerimaanEntries search={search} columns={columns} />
      </CardContent>

      <DialogRejection dialogRef={dialogRejectionRef} id={id} />
    </Card>
  )
}

const PenerimaanEntries = memo(({ search, columns }: { search: string; columns: GridColDef[] }) => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.ruanganLaboratorium)

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
    await dispatch(getPendaftaranAsistenLab({ data: body }))
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
