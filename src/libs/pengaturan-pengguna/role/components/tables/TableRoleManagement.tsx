import { Box, Button, Card, CardContent, CardHeader, debounce, TextField } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { memo, useCallback, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { getAllRole } from 'src/stores/role/action'
import HeaderPage from 'src/components/shared/header-page'
import DataTable from 'src/components/shared/table'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import Can from 'src/layouts/components/acl/Can'
import createColumns from './column'

export default function TableRoleManagement() {
  const router = useRouter()

  const [search, setSearch] = useState('')

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  const columns = createColumns({
    onEdit: (id: string) => router.push(`/pengaturan-pengguna/role/${id}/edit`),
    onDuplicate: (id: string) => router.push(`/pengaturan-pengguna/role/${id}/duplicate`)
  })

  const onAdd = () => router.push(`/pengaturan-pengguna/role/create`)

  return (
    <Card>
      <HeaderPage title='Manajemen Role' />

      <CardHeader
        title={
          <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              size='small'
              placeholder='Cari Nama'
              onChange={(e: any) => handleSearch(e.target.value)}
              sx={{ minWidth: 200, pr: 2 }}
              fullWidth
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Can I={'create'} a={'ROLE_MANAGEMENT'}>
              <Button variant='contained' color='primary' onClick={onAdd} startIcon={<Icon icon='ic:baseline-add' />}>
                Tambah Role
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

      <CardContent style={{ paddingInline: '10px' }}>
        <RoleEntries search={search} columns={columns} />
      </CardContent>
    </Card>
  )
}

const RoleEntries = memo(({ search, columns }: { search: string; columns: GridColDef[] }) => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.role)

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
          name: search
        }
      }
    }

    if (!search || search === '') delete body.params.searchFilters

    // @ts-ignore
    await dispatch(getAllRole({ data: body }))
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
