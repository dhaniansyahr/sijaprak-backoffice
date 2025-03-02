import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import DialogConfirmation from '../components/dialogs/DialogConfirmation'
import { NextRouter, useRouter } from 'next/router'

export default function AssignAsistenToJadwal() {
  const router: NextRouter = useRouter()

  const { watch, setValue } = useForm()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false)

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
      field: 'name',
      headerName: 'Nama Mahasiswa',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.shift ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'npm',
      headerName: 'NPM',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.startTime ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'semester',
      headerName: 'Semester',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.endTime ?? '-'}</span>
      }
    }
  ]

  return (
    <Fragment>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <IconButton
                sx={{
                  transform: 'translateX(-5px)',
                  transition: 'transform 0.3s'
                }}
                onClick={() => router.back()}
              >
                <Icon icon='meteor-icons:arrow-left' />
              </IconButton>
              <Typography variant='h6' fontWeight={500}>
                Tambahkan Asisten Lab ke Jadwal Praktikum
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

      <Card sx={{ padding: '16px' }}>
        <CardContent sx={{ padding: '24px' }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
                <Grid item xs={4}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    Mata Kuliah
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body1'>Rekayasa Perangakat Lunak</Typography>
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
                  <Typography variant='body1'>Rekayasa Perangakat Lunak</Typography>
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
                  <Typography variant='body1'>Rekayasa Perangakat Lunak</Typography>
                </Grid>
              </Grid>
            </Grid>

            {[
              {
                label: 'Dosen Pengajar 1',
                field: 'dosenPengajar1'
              },
              {
                label: 'Dosen Pengajar 2',
                field: 'dosenPengajar2'
              },
              {
                label: 'Asisten Lab 1',
                field: 'asistenLab1'
              },
              {
                label: 'Asisten Lab 2',
                field: 'asistenLab2'
              },
              {
                label: 'Asisten Lab 3',
                field: 'asistenLab3'
              },
              {
                label: 'Asisten Lab 4',
                field: 'asistenLab4'
              }
            ].map((item: any, index: number) => (
              <Grid item xs={12} md={6} key={index}>
                <Grid container spacing={2} borderBottom={'1px solid #4C4E6438'} paddingBottom={'8px'}>
                  <Grid item xs={8}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      {item?.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='body1'>{item?.field}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ padding: '24px' }}>
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            List Asisten Lab yang diterima oleh Dosen Pengajar
          </Typography>
        </CardContent>

        <Divider />

        <CardContent sx={{ padding: '24px' }}>
          <DataGrid
            autoHeight
            rows={[]}
            columns={columns}
            pagination
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            hideFooter
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

        <Divider />

        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'end'
          }}
        >
          <Button variant='contained' color='secondary'>
            Batal
          </Button>
          <Button variant='contained' color='success' onClick={() => setIsConfirmationDialogOpen(true)}>
            assign
          </Button>
        </CardActions>
      </Card>

      <DialogConfirmation
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        values={null}
        type='CREATE'
      />
    </Fragment>
  )
}
