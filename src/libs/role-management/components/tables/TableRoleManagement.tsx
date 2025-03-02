import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  debounce,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import DialogCreate from '../dialogs/DialogCreate'
import DialogEdit from '../dialogs/DialogEdit'
import DialogDelete from '../dialogs/DialogDelete'
import { NextRouter, useRouter } from 'next/router'

export default function TableRoleManagement() {
  const router: NextRouter = useRouter()

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<any>('')
  const [isMenuOpen, setIsMenuOpen] = useState<any>('')

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const columns = [
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
      field: 'nama',
      headerName: 'Nama Role',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.nama}</span>
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
              <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                onClick={() => setIsEditDialogOpen(true)}
              >
                <span>Edit Role</span>
              </MenuItem>

              <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <span>Delete Role</span>
              </MenuItem>

              <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                onClick={() => {
                  setIsMenuOpen('')
                  router.push(`/role-management/${params?.row?.id}/create-access`)
                }}
              >
                <span>Tambah Akses</span>
              </MenuItem>

              <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                onClick={() => {
                  setIsMenuOpen('')
                  router.push(`/role-management/${params?.row?.id}/edit-access`)
                }}
              >
                <span>Edit Akses</span>
              </MenuItem>
            </Menu>
          </div>
        )
      }
    }
  ]

  const handleGetAll = async () => {
    setIsLoading(true)

    // const body = {
    //   params: {
    //     page: isPagination ? page : 1,
    //     rows: pageSize,
    //     searchFilters: {
    //       namaKepala: search
    //     }
    //   }
    // } as any

    // if (!search) {
    //   delete body.params.searchFilters['namaKepala']
    // }

    // body.params.searchFilters = JSON.stringify(body.params.searchFilters)

    // // @ts-ignore
    // await dispatch(getAllCentralUnit({ data: body })).then((res: any) => {
    //   if (
    //     !(res?.payload?.content?.entries ?? []).some((obj: any) =>
    //       (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
    //     ) &&
    //     isPagination
    //   ) {
    //     const _entries = [...(data?.entries ?? []), ...(res?.payload?.content?.entries ?? [])]
    //     setData(Object.assign({}, res?.payload?.content, { entries: _entries }))
    //   } else {
    //     if (!res?.payload?.content?.entries?.length && res?.payload?.content?.totalPage === 1) {
    //       setData(null)
    //     } else if (!isPagination) {
    //       setData(res?.payload?.content)
    //     }
    //   }
    // })

    setData({
      entries: [
        {
          id: 1,
          nama: 'Laboran'
        },
        {
          id: 2,
          nama: 'Kepala Laboran'
        }
      ],
      totalData: 5
    })

    setIsLoading(false)
  }

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

  return (
    <Fragment>
      <Card sx={{ mb: 4 }} elevation={4}>
        <CardHeader
          title={
            <Box>
              <Typography variant='h6' fontWeight={500}>
                Manajemen Role
              </Typography>
            </Box>
          }
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' },
            borderBottom: '1px solid #f4f4f4'
          }}
        />
      </Card>
      <Card elevation={4}>
        <CardHeader
          title={
            <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
              <TextField
                size='small'
                placeholder='Cari Nama'
                onChange={(e: any) => handleSearch(e.target.value)}
                sx={{ minWidth: 200 }}
              />
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant='contained'
                color='primary'
                sx={{ mb: 2 }}
                onClick={() => setIsCreateDialogOpen(true)}
                startIcon={<Icon icon='ic:baseline-add' />}
              >
                Tambah Role
              </Button>
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
          <DataGrid
            autoHeight
            rows={data?.entries ?? []}
            columns={columns}
            pagination
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            rowCount={data?.totalData ?? 0}
            paginationModel={{
              page: page - 1,
              pageSize: pageSize
            }}
            onPaginationModelChange={(newModel: any) => {
              setPage(newModel.page + 1)
              setPageSize(newModel.pageSize)
            }}
            loading={isLoading}
            slots={{
              loadingOverlay: CircularProgress
            }}
            sx={{
              [`& .${gridClasses.cell}`]: {
                py: 1
              }
            }}
          />
        </CardContent>
      </Card>

      <DialogCreate open={isCreateDialogOpen} onClose={(v: boolean) => setIsCreateDialogOpen(v)} />

      <DialogEdit open={isEditDialogOpen} onClose={(v: boolean) => setIsEditDialogOpen(v)} />

      <DialogDelete open={isDeleteDialogOpen} onClose={(v: boolean) => setIsDeleteDialogOpen(v)} />
    </Fragment>
  )
}
