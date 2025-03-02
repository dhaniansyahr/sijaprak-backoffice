import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  debounce,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Fragment, useCallback, useEffect, useState } from 'react'
import DialogConfirmation from '../dialogs/DialogConfirmation'
import DialogRejection from '../dialogs/DialogRejection'

export default function TablePelamar() {
  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [search, setSearch] = useState<any>('')

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false)
  const [isRejectDialogOpen, setIsRejectOpen] = useState<boolean>(false)

  const [rowSelected, setRowSelected] = useState<any>(null)

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
      headerName: 'Nama',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.nama}</span>
      }
    },
    {
      flex: 0.25,
      field: 'startTime',
      headerName: 'Npm',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.startTime}</span>
      }
    },
    {
      flex: 0.25,
      field: 'endTime',
      headerName: 'Semester',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.endTime}</span>
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
          <Box display='flex' alignItems='center' gap={2}>
            <Button variant='contained' size='small' color='success' onClick={() => setIsConfirmationDialogOpen(true)}>
              Terima
            </Button>
            <Button variant='contained' size='small' color='error' onClick={() => setIsRejectOpen(true)}>
              Tolak
            </Button>
          </Box>
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
          nama: 'Sesi 1',
          startTime: '08:00 WIB',
          endTime: '09:40 WIB'
        },
        {
          id: 2,
          nama: 'Sesi 2',
          startTime: '09:50 WIB',
          endTime: '11:30 WIB'
        },
        {
          id: 3,
          nama: 'Sesi 3',
          startTime: '12:00 WIB',
          endTime: '13:40 WIB'
        },
        {
          id: 4,
          nama: 'Sesi 4',
          startTime: '14:00 WIB',
          endTime: '15:40 WIB'
        },
        {
          id: 5,
          nama: 'Sesi 5',
          startTime: '16:00 WIB',
          endTime: '17:40 WIB'
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
                Penerimaan Asisten Laboratorium
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

      <DialogConfirmation
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        values={rowSelected}
      />

      <DialogRejection open={isRejectDialogOpen} onClose={() => setIsRejectOpen(false)} values={rowSelected} />
    </Fragment>
  )
}
