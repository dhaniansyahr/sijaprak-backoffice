// React Imports
import { Box, Button, Card, CardContent, CardHeader, debounce, TextField } from '@mui/material'
import { memo, useEffect, useState, useCallback, useRef } from 'react'

// Hooks & types
import HeaderPage from 'src/components/shared/header-page'
import DataTable from 'src/components/shared/table'

import Can from 'src/layouts/components/acl/Can'
import { createColumns } from './columns'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import { GridColDef } from '@mui/x-data-grid'
import { deleteRuanganLaboratorium, getAllRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'
import DialogsRuangan, { IDialogsRuanganRef } from '../dialogs'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'

const TableRuangan = memo(() => {
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')
  const [values, setValues] = useState<any>(null)

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  const dialogsRef = useRef<IDialogsRuanganRef>(null)

  const onOpenDialogAdd = () => dialogsRef.current?.openDialogAdd()

  const onDelete = async (id: string) => {
    toast.loading('Loading...')

    const body = {
      params: {
        ids: JSON.stringify([id])
      }
    }

    // @ts-ignore
    await dispatch(deleteRuanganLaboratorium({ data: body }))
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
    onDetail: (v: any) => {
      setValues(v)
      dialogsRef.current?.openDialogDetail(v)
    },
    onEdit: (v: any) => {
      setValues(v)
      dialogsRef.current?.openDialogEdit(v)
    },
    onChange: (v: any) => {
      setValues(v)
      dialogsRef.current?.openDialogChange(v)
    },
    onDelete: (id: string) => onDelete(id)
  })

  return (
    <Card>
      <HeaderPage title='Manajemen Ruangan Laboratorium' />

      <CardHeader
        title={
          <Box display='flex' flexWrap='wrap' gap={1.5} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari Nama Ruangan'
              onChange={e => handleSearch(e.target.value)}
              sx={{ minWidth: 200, pr: 2 }}
            />
          </Box>
        }
        action={
          <Can I={'create'} a={'RUANGAN'}>
            <Button
              variant='contained'
              color='primary'
              sx={{ mb: 2 }}
              onClick={onOpenDialogAdd}
              startIcon={<Icon icon='mdi: plus' />}
            >
              Tambah Laboratorium
            </Button>
          </Can>
        }
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'start', md: 'center' },
          borderBottom: '1px solid #f4f4f4'
        }}
      />
      <CardContent>
        <RuanganEntries search={search} columns={columns} />

        <DialogsRuangan ref={dialogsRef} values={values} setValues={setValues} />
      </CardContent>
    </Card>
  )
})

TableRuangan.displayName = 'TableRuangan'

export default TableRuangan

const RuanganEntries = memo(({ search, columns }: { search: string; columns: GridColDef[] }) => {
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
        searchFilters: JSON.stringify({
          nama: search
        }),
        filters: JSON.stringify({
          isLab: true
        })
      }
    }

    if (!search || search === '') delete body.params.searchFilters

    // @ts-ignore
    await dispatch(getAllRuanganLaboratorium({ data: body }))
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
