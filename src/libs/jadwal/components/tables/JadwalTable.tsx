import { Icon } from '@iconify/react'
import { Box, CircularProgress, IconButton, Menu, MenuItem } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { NextRouter, useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

export default function JadwalTable({ events }: any) {
  const router: NextRouter = useRouter()

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const [isMenuOpen, setIsMenuOpen] = useState<any>('')

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
        return <span>{params?.row?.title}</span>
      }
    },
    {
      flex: 0.25,
      field: 'shiftName',
      headerName: 'Nama Shift',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.data?.shiftName}</span>
      }
    },
    {
      flex: 0.25,
      field: 'shiftTime',
      headerName: 'Waktu Shift',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.data?.shiftTime}</span>
      }
    },
    {
      flex: 0.25,
      field: 'dosen',
      headerName: 'Dosen Pengampu',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {params?.row?.data?.dosen?.map((item: any, index: number) => (
              <span key={index}>{item?.name}</span>
            ))}
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'aslab',
      headerName: 'Asisten Lab',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            {params?.row?.data?.asistenLab?.map((item: any, index: number) => (
              <span key={index}>{item?.name}</span>
            ))}
          </>
        )
      }
    },
    {
      flex: 0.25,
      field: 'isActive',
      headerName: 'Is Active',
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
                onClick={() => {
                  setIsMenuOpen('')
                  router.push(`/jadwal/${params?.row?.id}/assign-assisten`)
                }}
              >
                <Icon icon='solar:user-id-broken' />
                <span>Tambahkan Asisten Lab</span>
              </MenuItem>

              <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                onClick={() => {
                  setIsMenuOpen('')
                  router.push(`/jadwal/${params?.row?.id}/edit`)
                }}
              >
                <Icon icon='mdi:pencil-outline' />
                <span>Edit Praktikum</span>
              </MenuItem>

              <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                onClick={() => {
                  setIsMenuOpen('')
                  router.push(`/jadwal/${params?.row?.id}/detail`)
                }}
              >
                <Icon icon='ph:eye' />
                <span>Detail Praktikum</span>
              </MenuItem>

              <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
                onClick={() => {
                  setIsMenuOpen('')
                  router.push(`/jadwal/${params?.row?.id}/pengajuan-pergantian`)
                }}
              >
                <Icon icon='mdi:trash-outline' />
                <span>Ajukan Pergantian Jadwal</span>
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
      entries: events,
      totalData: 5
    })

    setIsLoading(false)
  }

  useEffect(() => {
    setPage(1)

    handleGetAll()
  }, [])

  useEffect(() => {
    if (page !== 1) {
      handleGetAll()
    }
  }, [page, pageSize])

  return (
    <Fragment>
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
    </Fragment>
  )
}
