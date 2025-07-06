import { Box, Card, CardContent, Checkbox, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import HeaderPage from 'src/components/shared/header-page'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import { absent, getAbsensi } from 'src/stores/jadwal/action'
import toast from 'react-hot-toast'
import { setIsRefresh } from 'src/stores/jadwal/slice'
import { DataGrid, gridClasses } from '@mui/x-data-grid'

export default function AbsensiContainer() {
  const router: NextRouter = useRouter()
  const dispatch = useAppDispatch()

  const { isRefresh } = useAppSelector(state => state.jadwal)

  const { id } = router.query as { id: string }

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)

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
        return <span>{params?.row?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'noIdentitas',
      headerName: 'NIP/NPM',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        const nomorIdentitas = params?.row?.nip || params?.row?.npm

        return <span>{nomorIdentitas ?? '-'}</span>
      }
    },
    ...(data?.[0]?.meetings?.map((meeting: any) => ({
      flex: 0.25,
      field: `pertemuan_${meeting.pertemuan}`,
      headerName: `Pertemuan ${meeting.pertemuan}`,
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        const meetingData = params.row.meetings.find((m: any) => m.pertemuan === meeting.pertemuan)

        return (
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Checkbox
              checked={meetingData?.isPresent}
              onChange={() => handleAbsent(params?.row?.id, meeting.id, id, !meetingData?.isPresent)}
              sx={{
                width: 'fit-content'
              }}
            />
            <Typography variant='body2'>{meetingData?.isPresent ? 'Hadir' : 'Tidak Hadir'}</Typography>
          </Box>
        )
      }
    })) ?? [])

    // {
    //   flex: 0.25,
    //   field: 'action',
    //   headerName: 'Aksi',
    //   sortable: false,
    //   renderCell: (params: any) => {
    //     return <span>{params?.row?.action ?? '-'}</span>
    //   }
    // }
  ]

  const handleGetData = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getAbsensi({ id })).then((res: any) => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        return
      }

      const content = res.payload.content

      setData(content)
    })

    setIsLoading(false)
  }

  const handleAbsent = async (userId: string, meetingId: string, jadwalId: string, isPresent: boolean) => {
    toast.loading('Loading...')

    const body = {
      meetingId,
      jadwalId,
      isPresent,
      userId
    }

    // @ts-ignore
    await dispatch(absent({ data: body })).then((res: any) => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error('Gagal melakukan absensi!')

        return
      }

      toast.dismiss()
      toast.success('Berhasil melakukan absensi!')

      // @ts-ignore
      dispatch(setIsRefresh(!isRefresh))
    })
  }

  useEffect(() => {
    handleGetData()
  }, [id, isRefresh])

  return (
    <Card sx={{ padding: '16px' }}>
      <HeaderPage title='Detail Absensi' icon='mdi:arrow-left' />

      <CardContent sx={{ padding: '24px !important' }}>
        <DataGrid
          autoHeight
          getRowHeight={() => 'auto'}
          rows={data ?? []}
          columns={columns}
          hideFooter
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          rowCount={data?.totalData ?? 0}
          loading={isLoading}
          slots={{
            loadingOverlay: CircularProgress
          }}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 1
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 600
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        />
      </CardContent>
    </Card>
  )
}
