import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Box, Button, CircularProgress } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

export default function DashboardContainers() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)

  const columns = [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 100,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'mk',
      headerName: 'Mata Kuliah',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.row?.mataKuliah?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'dosen',
      headerName: 'Dosen',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.row?.dosen?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'namaRuangan',
      headerName: 'Nama Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.row?.ruangan?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'lokasi',
      headerName: 'Lokasi Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.row?.ruangan?.lokasi ?? '-'}</span>
      }
    }
  ]

  const handleGetData = async () => {
    setIsLoading(true)

    setData({
      entries: [
        {
          index: 1,
          mataKuliah: {
            nama: 'Pemrograman Web'
          },
          dosen: {
            nama: 'Dr. Budi Santoso'
          },
          ruangan: {
            nama: 'Lab Komputer 1',
            lokasi: 'Gedung A Lt. 3'
          }
        },
        {
          index: 2,
          mataKuliah: {
            nama: 'Basis Data'
          },
          dosen: {
            nama: 'Dr. Siti Aminah'
          },
          ruangan: {
            nama: 'Lab Database',
            lokasi: 'Gedung B Lt. 2'
          }
        },
        {
          index: 3,
          mataKuliah: {
            nama: 'Jaringan Komputer'
          },
          dosen: {
            nama: 'Dr. Ahmad Wijaya'
          },
          ruangan: {
            nama: 'Lab Networking',
            lokasi: 'Gedung A Lt. 4'
          }
        }
      ],
      totalData: 3,
      totalPages: 1
    })

    setIsLoading(false)
  }

  useEffect(() => {
    handleGetData()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title={
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 500 }}>
                  Jadwal Hari ini
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

          <CardContent sx={{ paddingY: '16px' }}>
            <DataGrid
              autoHeight
              rows={data?.entries ?? []}
              columns={columns}
              hideFooter
              getRowId={row => row.index}
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
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 500 }}>
                  Absen
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
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 500 }}>
                  Rekayasa Perangkat Lunak - Pertemuan Ke 1
                </Typography>
              </Box>
            }
            action={<Button variant='contained'>Absen</Button>}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'start', md: 'center' }
            }}
          />

          <CardContent sx={{ marginTop: '16px' }}>
            <Grid container spacing={4}>
              {[
                {
                  field: 'Mata Kuliah',
                  value: 'Rekayasa Perangkat Lunak'
                },
                {
                  field: 'Dosen Pengajar',
                  value: 'Dosen 1'
                },
                {
                  field: 'Tanggal',
                  value: '01 Januari 2025'
                },
                {
                  field: 'Ruangan',
                  value: 'Laboratorium Rekayasa Perangkat Lunak'
                },
                {
                  field: 'Waktu',
                  value: '08:00 - 09:40 WIB'
                },
                {
                  field: 'Pertemuan',
                  value: '01'
                }
              ].map((item: any, index: number) => (
                <Grid item xs={6} key={index}>
                  <Grid container spacing={2} borderBottom={'1px solid #4c4e6438'} paddingBottom={'16px'}>
                    <Grid item xs={4}>
                      <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                        {item.field}
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant='body1'>{item.value}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
