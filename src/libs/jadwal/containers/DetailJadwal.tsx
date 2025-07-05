import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { Fragment, memo, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { useAppDispatch } from 'src/utils/dispatch'
import HeaderPage from 'src/components/shared/header-page'
import DefaultTable from 'src/components/shared/table'
import { getJadwal } from 'src/stores/jadwal/action'
import DataTable from 'src/components/shared/table'

const DetailValue = memo(({ data }: { data: any }) => {
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
            <Typography variant='body1'>{data?.matakuliah?.nama ?? '-'}</Typography>
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
            <Typography variant='body1'>
              {data?.shift?.startTime ?? '-'} - {data?.shift?.endTime ?? '-'}
            </Typography>
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
            <Typography variant='body1'>{data?.ruangan?.nama ?? '-'}</Typography>
          </Grid>
        </Grid>
      </Grid>

      {data?.dosen?.map((item: any, index: number) => (
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
    </Fragment>
  )
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
        return <span>{params?.row?.name ?? '-'}</span>
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

    // @ts-ignore
    await dispatch(getJadwal({ id })).then((res: any) => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setState(prev => ({ ...prev, isLoading: false }))

        return
      }

      setState(prev => ({ ...prev, isLoading: false, data: res.payload.content }))
    })
  }

  useEffect(() => {
    handleGetDetail()
  }, [id])

  return (
    <Card sx={{ padding: '16px' }}>
      <HeaderPage title='Detail Jadwal Praktikum' icon='meteor-icons:arrow-left' />

      <CardContent sx={{ padding: '24px !important' }}>
        <Grid container spacing={4}>
          <DetailValue data={state?.data} />

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              List Mahasiswa Praktikum
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <DataTable
              data={state?.data?.mahasiswa ?? []}
              columns={columns}
              page={1}
              pageSize={10}
              isLoading={state?.isLoading}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
