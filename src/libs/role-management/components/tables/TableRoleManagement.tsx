import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  debounce,
  IconButton,
  Menu,
  MenuItem,
  TextField
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { NextRouter, useRouter } from 'next/router'
import { getAllRole } from 'src/stores/role/action'
import HeaderPage from 'src/components/shared/header-page'
import DataTable from 'src/components/shared/table'
import { useAppDispatch } from 'src/utils/dispatch'
import { enumToCapitalize } from 'src/utils/string.format'
import Can, { AbilityContext } from 'src/layouts/components/acl/Can'

export default function TableRoleManagement() {
  const router: NextRouter = useRouter()
  const dispatch = useAppDispatch()
  const ability = useContext(AbilityContext)

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<any>('')
  const [isMenuOpen, setIsMenuOpen] = useState<any>('')

  const isActionAllowed = useMemo(() => {
    return ability?.can('create', 'ROLE_MANAGEMENT') || ability?.can('update', 'ROLE_MANAGEMENT')
  }, [ability])

  const columns: GridColDef[] = useMemo(
    () => [
      {
        flex: 0.25,
        field: 'no',
        headerName: 'No',
        maxWidth: 80,
        sortable: false,
        renderCell: (params: any) => {
          return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
        }
      },
      {
        flex: 0.25,
        field: 'name',
        headerName: 'Nama Role',
        minWidth: 160,
        sortable: false,
        renderCell: (params: any) => {
          return <span>{enumToCapitalize(params?.row?.name || '-')}</span>
        }
      }
    ],
    []
  )

  if (isActionAllowed) {
    columns.push({
      flex: 0.25,
      field: 'action',
      headerName: 'Aksi',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div>
            <IconButton id={params?.row?.id} onClick={() => setIsMenuOpen(params?.row?.id)}>
              <Icon icon='mage:dots' />
            </IconButton>

            <Menu
              id={params?.row?.id}
              anchorEl={document.getElementById(params?.row?.id)}
              open={isMenuOpen === params?.row?.id}
              onClose={() => setIsMenuOpen('')}
              MenuListProps={{
                'aria-labelledby': params?.row?.id
              }}
            >
              <Can I={'update'} a={'ROLE_MANAGEMENT'}>
                <MenuItem
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                  onClick={() => router.push(`/role-management/${params?.row?.id}/edit`)}
                >
                  <span>Edit Role</span>
                </MenuItem>
              </Can>

              <Can I={'create'} a={'ROLE_MANAGEMENT'}>
                <MenuItem
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                  onClick={() => router.push(`/role-management/${params?.row?.id}/duplicate`)}
                >
                  <span>Duplicate Role</span>
                </MenuItem>
              </Can>

              {/* <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                onClick={() => router.push(`/role-management/${params?.row?.id}/delete`)}
              >
                <span>Delete</span>
              </MenuItem> */}
            </Menu>
          </div>
        )
      }
    })
  }

  const handleGetAll = useCallback(
    async (isPagination = false) => {
      setIsLoading(true)

      const body = {
        params: {
          page: isPagination ? page : 1,
          rows: pageSize,
          searchFilters: {
            nama: search
          }
        }
      } as any

      if (!search) delete body.params.searchFilters

      body.params.searchFilters = JSON.stringify(body.params.searchFilters)

      // @ts-ignore
      await dispatch(getAllRole({ data: body })).then((res: any) => {
        if (
          !(res?.payload?.content?.entries ?? []).some((obj: any) =>
            (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
          ) &&
          isPagination
        ) {
          const _entries = [...(data?.entries ?? []), ...(res?.payload?.content?.entries ?? [])]
          setData(Object.assign({}, res?.payload?.content, { entries: _entries }))
        } else {
          if (!res?.payload?.content?.entries?.length && res?.payload?.content?.totalPage === 1) {
            setData(null)
          } else if (!isPagination) {
            setData(res?.payload?.content)
          }
        }
      })

      setIsLoading(false)
    },
    [page, pageSize, search]
  )

  const handleSearch = useCallback(
    debounce((query: any) => {
      setSearch(query)
    }, 300),
    []
  )

  useEffect(() => {
    setPage(1)

    handleGetAll()
  }, [search])

  useEffect(() => {
    if (page !== 1) {
      handleGetAll()
    }
  }, [page, pageSize])

  const onPaginationModelChange = (newModel: any) => {
    setPage(newModel.page + 1)
    setPageSize(newModel.pageSize)
  }

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
              <Button
                variant='contained'
                color='primary'
                onClick={() => router.push('/role-management/create')}
                startIcon={<Icon icon='ic:baseline-add' />}
              >
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
        <DataTable
          data={data}
          columns={columns}
          page={page}
          pageSize={pageSize}
          isLoading={isLoading}
          onPaginationModelChange={onPaginationModelChange}
        />
      </CardContent>
    </Card>
  )
}
