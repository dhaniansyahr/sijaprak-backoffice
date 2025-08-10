import { Box, Button, Card, CardContent, CardHeader, debounce, TextField } from '@mui/material'
import { memo, useState, useCallback, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import HeaderPage from 'src/components/shared/header-page'
import DialogAdd from '../dialogs/DialogAdd'
import DataTable from 'src/components/shared/table'
import Can from 'src/layouts/components/acl/Can'
import { createColumns } from './column'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import toast from 'react-hot-toast'
import { deleteShift, getAllShift } from 'src/stores/master-data/shift/action'
import { setIsRefresh } from 'src/stores/master-data/shift/slice'
import { GridColDef } from '@mui/x-data-grid'
import { IDialogRef } from 'src/components/shared/dialog'

const TableShift = () => {
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')

  const dialogAddRef = useRef<IDialogRef>(null)

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  const onDelete = async (id: string) => {
    toast.loading('Loading...')

    const body = {
      params: {
        ids: JSON.stringify([id])
      }
    }

    // @ts-ignore
    await dispatch(deleteShift({ data: body }))
      .then(res => {
        if (res.meta.requestStatus !== 'fulfilled') {
          toast.error(res?.payload?.response?.data?.message)

          return
        }

        toast.success(res?.payload?.message)
        dispatch(setIsRefresh())
      })
      .finally(() => toast.dismiss())
  }

  const columns = createColumns({
    onDelete: (id: string) => onDelete(id)
  })

  const onOpenDialogAdd = () => dialogAddRef.current?.open()

  return (
    <Card elevation={4}>
      <HeaderPage title='Management Shift' />

      <CardHeader
        title={
          <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari waktu mulai dan waktu berakhir'
              onChange={e => handleSearch(e.target.value)}
              sx={{ minWidth: 200, pr: 2 }}
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Can I={'create'} a={'SHIFT'}>
              <Button
                variant='contained'
                color='primary'
                onClick={onOpenDialogAdd}
                startIcon={<Icon icon='ic:baseline-add' />}
              >
                Tambah Shift
              </Button>
            </Can>
          </Box>
        }
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'start', md: 'center' },
          borderBottom: '1px solid #f4f4f4'
        }}
      />

      <CardContent>
        <ShiftEntries search={search} columns={columns} />
      </CardContent>

      <DialogAdd dialogRef={dialogAddRef} />
    </Card>
  )
}

export default TableShift

const ShiftEntries = memo(({ search, columns }: { search: string; columns: GridColDef[] }) => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.shift)

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
          startTime: search,
          endTime: search
        }
      }
    }

    if (!search || search === '') delete body.params.searchFilters

    // @ts-ignore
    await dispatch(getAllShift({ data: body }))
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
