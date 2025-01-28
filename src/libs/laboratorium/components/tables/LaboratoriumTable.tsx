import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
  Typography,
  debounce
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import CreateLaboratoriumDialog from '../dialogs/CreateLaboratoriumDialog'
import EditLaboratoriumDialog from '../dialogs/EditLaboratoriumDialog'
import DetailLaboratoriumDialog from '../dialogs/DetailLaboratoriumDialog'
import ChangeKepalaLaboratoriumDialog from '../dialogs/ChangeKepalaLaboratoriumDialog'

export default function LaboratoriumTable() {
  const [data, setData] = useState<any>()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<any>('')

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false)
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState<boolean>(false)
  const [itemSelected, setItemSelected] = useState<any>(null)

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
      headerName: 'Nama Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.nama}</span>
      }
    },
    {
      flex: 0.25,
      field: 'kepala',
      headerName: 'Kepala Lab',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.namaKepala}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nip',
      headerName: 'NIP',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.nip}</span>
      }
    },
    {
      flex: 0.25,
      field: 'letak',
      headerName: 'Lokasi Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.namaKepala}</span>
      }
    },
    {
      flex: 0.25,
      field: 'isActive',
      headerName: 'Is Active',
      minWidth: 160,
      sortable: false,
      renderCell: () => {
        return <Switch color='success' />
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'ACTION',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: 2
            }}
          >
            <IconButton
              id={params?.row?.id}
              onClick={() => {
                setIsDetailDialogOpen(true)
                setItemSelected(params?.row)
              }}
            >
              <Icon icon='ph:eye' />
            </IconButton>
            <IconButton
              id={params?.row?.id}
              onClick={() => {
                setIsEditDialogOpen(true)
                setItemSelected(params?.row)
              }}
            >
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
            <IconButton
              id={params?.row?.id}
              onClick={() => {
                setIsChangeDialogOpen(true)
                setItemSelected(params?.row)
              }}
            >
              <Icon icon='ic:round-change-circle' />
            </IconButton>
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
          nama: 'Laboratorium 1',
          namaKepala: 'Dr. John Doe',
          nip: '1234567890',
          lokasi: 'Gedung A Lt. 3'
        },
        {
          id: 2,
          nama: 'Laboratorium 2',
          namaKepala: 'Dr. Jane Doe',
          nip: '9876543210',
          lokasi: 'Gedung B Lt. 2'
        }
      ]
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
    <>
      <Card>
        <CardHeader
          title={
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 500 }}>
                Manajemen Laboratorium
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
              <Button variant='contained' color='primary' sx={{ mb: 2 }} onClick={() => setIsCreateDialogOpen(true)}>
                Tambah Laboratorium
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

      <CreateLaboratoriumDialog open={isCreateDialogOpen} onClose={(v: boolean) => setIsCreateDialogOpen(v)} />

      <EditLaboratoriumDialog
        open={isEditDialogOpen}
        onClose={(v: boolean) => setIsEditDialogOpen(v)}
        values={itemSelected}
      />

      <DetailLaboratoriumDialog
        open={isDetailDialogOpen}
        onClose={(v: boolean) => setIsDetailDialogOpen(v)}
        values={itemSelected}
      />

      <ChangeKepalaLaboratoriumDialog
        open={isChangeDialogOpen}
        onClose={(v: boolean) => setIsChangeDialogOpen(v)}
        values={itemSelected}
      />
    </>
  )
}
