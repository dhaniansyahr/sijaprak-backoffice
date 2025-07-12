import { Card, CardContent, CircularProgress, Grid, Skeleton, Typography } from '@mui/material'
import { Fragment, memo, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { useAppDispatch } from 'src/utils/dispatch'
import HeaderPage from 'src/components/shared/header-page'
import { getAllMeetings, getJadwal } from 'src/stores/jadwal/action'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import moment from 'moment'

const DetailValue = memo(({ data, isLoading }: { data: any; isLoading: boolean }) => {
  return (
    <Fragment>
      <Grid item xs={12}>
        <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
          <Grid item xs={4}>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              Mata Kuliah
            </Typography>
          </Grid>
          <Grid item xs={8}>
            {isLoading ? (
              <Skeleton variant='text' sx={{ width: '100%' }} />
            ) : (
              <Typography variant='body1'>{data?.matakuliah?.nama ?? '-'}</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
          <Grid item xs={4}>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              Waktu Praktikum
            </Typography>
          </Grid>
          <Grid item xs={8}>
            {isLoading ? (
              <Skeleton variant='text' sx={{ width: '100%' }} />
            ) : (
              <Typography variant='body1'>
                {data?.shift?.startTime ?? '-'} - {data?.shift?.endTime ?? '-'}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} marginBottom={'16px'}>
        <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
          <Grid item xs={4}>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              Ruangan Praktikum
            </Typography>
          </Grid>
          <Grid item xs={8}>
            {isLoading ? (
              <Skeleton variant='text' sx={{ width: '100%' }} />
            ) : (
              <Typography variant='body1'>{data?.ruangan?.nama ?? '-'}</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      {isLoading
        ? Array.from({ length: 2 }).map((_, idx: number) => (
            <Grid item xs={12} marginBottom={'16px'} key={idx}>
              <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
                <Grid item xs={4}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    Dosen Pengampu {idx + 1}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Skeleton variant='text' sx={{ width: '100%' }} key={idx} />
                </Grid>
              </Grid>
            </Grid>
          ))
        : data?.dosen?.map((item: any, index: number) => (
            <Grid item xs={12} marginBottom={'16px'} key={index}>
              <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
                <Grid item xs={4}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    Dosen Pengampu {index + 1}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body1'>
                    {item?.nama ?? '-'} ({item?.nip ?? '-'})
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}

      {isLoading
        ? Array.from({ length: 2 }).map((_, idx: number) => (
            <Grid item xs={12} marginBottom={'16px'} key={idx}>
              <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
                <Grid item xs={4}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    Asisten Lab {idx + 1}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Skeleton variant='text' sx={{ width: '100%' }} key={idx} />
                </Grid>
              </Grid>
            </Grid>
          ))
        : data?.asisten?.map((item: any, index: number) => (
            <Grid item xs={12} marginBottom={'16px'} key={index}>
              <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
                <Grid item xs={4}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    Asisten Lab {index + 1}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body1'>
                    {item?.Mahasiswa?.[0]?.nama ?? '-'} ({item?.Mahasiswa?.[0]?.npm ?? '-'})
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
    </Fragment>
  )
})

const DetailPertemuan = memo(({ meetings, isLoading }: { meetings: any; isLoading: boolean }) => {
  return isLoading
    ? Array.from({ length: 12 }).map((_, idx: number) => (
        <Grid item xs={6} key={idx} marginBottom={'16px'}>
          <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
            <Grid item xs={4}>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                Pertemuan - {idx + 1}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Skeleton variant='text' sx={{ width: '100%' }} key={idx} />
            </Grid>
          </Grid>
        </Grid>
      ))
    : meetings?.map((meeting: any, meetingIdx: number) => {
        return (
          <Grid item xs={6} key={meetingIdx} marginBottom={'16px'}>
            <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
              <Grid item xs={4}>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  Pertemuan - {meetingIdx + 1}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant='body1'>{moment(meeting?.tanggal).format('dddd, DD MMMM YYYY')}</Typography>
              </Grid>
            </Grid>
          </Grid>
        )
      })
})

export default function DetailJadwal() {
  const router: NextRouter = useRouter()
  const dispatch = useAppDispatch()

  const { id } = router.query as { id: string }
  const [state, setState] = useState<{
    isLoading: boolean
    data: any
  }>({
    isLoading: false,
    data: null
  })

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
      headerName: 'Nama Mahasiswa',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'npm',
      headerName: 'NPM',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.npm ?? '-'}</span>
      }
    }
  ]

  const handleGetDetail = async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    const jadwal = await dispatch(getJadwal({ id }))

    if (jadwal.meta.requestStatus !== 'fulfilled') {
      setState(prev => ({ ...prev, isLoading: false }))

      return
    }

    setState(prev => ({ ...prev, isLoading: false, data: jadwal.payload.content }))
  }

  useEffect(() => {
    handleGetDetail()
  }, [id])

  return (
    <Card sx={{ padding: '16px' }}>
      <HeaderPage title='Detail Jadwal Praktikum' icon='meteor-icons:arrow-left' />

      <CardContent sx={{ padding: '24px !important' }}>
        <Grid container spacing={4}>
          <DetailValue data={state?.data} isLoading={state?.isLoading} />

          <Grid item xs={12}>
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              List Pertemuan
            </Typography>
          </Grid>

          <DetailPertemuan meetings={state?.data?.Meeting} isLoading={state?.isLoading} />

          <Grid item xs={12}>
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              List Mahasiswa Praktikum
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <DataGrid
              autoHeight
              getRowHeight={() => 'auto'}
              rows={state?.data?.mahasiswa ?? []}
              columns={columns}
              getRowId={(row: any) => row?.npm}
              hideFooter
              disableColumnFilter
              disableColumnMenu
              disableColumnSelector
              rowCount={state?.data?.totalData ?? 0}
              loading={state?.isLoading}
              slots={{
                loadingOverlay: CircularProgress
              }}
              sx={{
                [`& .${gridClasses.cell}`]: {
                  py: 2
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
