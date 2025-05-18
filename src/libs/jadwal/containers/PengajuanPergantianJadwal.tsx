import { Icon } from '@iconify/react'
import {
  Autocomplete,
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
  TextField,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Fragment, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePickerInputs from 'src/components/templates/custom/DatePickerInput'
import DialogConfirmation from '../components/dialogs/DialogConfirmation'
import { NextRouter, useRouter } from 'next/router'

export default function PengajuanPergantianJadwal() {
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
      field: 'shift',
      headerName: 'Shift',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.shift ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'startTime',
      headerName: 'Start Time',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.startTime ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'endTime',
      headerName: 'End Time',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.endTime ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'ruangan',
      headerName: 'Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.ruangan ?? '-'}</span>
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
          <Box>
            <Button variant='contained' size='small'>
              Pilih
            </Button>
          </Box>
        )
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
                Pengajuan Pergantian Jadwal
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
            <Grid item xs={12} md={6}>
              <DatePickerWrapper>
                <ReactDatePicker
                  isClearable
                  selected={watch('tanggal') ?? null}
                  dateFormat='yyyy-MM-dd'
                  customInput={<DatePickerInputs label='Tanggal' placeholderText='YYYY-MM-DD' />}
                  onChange={(date: any) => setValue('tanggal', date)}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={[]}
                getOptionLabel={(option: any) => option.name}
                filterSelectedOptions
                renderInput={params => (
                  <TextField {...params} required variant='outlined' label='Shift' placeholder='Pilih Shift' />
                )}
                value={watch('shift') ?? null}
                onChange={(e, v) => setValue('shift', v)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={[]}
                getOptionLabel={(option: any) => option.name}
                filterSelectedOptions
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    variant='outlined'
                    label='Mata Kuliah'
                    placeholder='Pilih Mata Kuliah'
                  />
                )}
                value={watch('mataKuliah') ?? null}
                onChange={(e, v) => setValue('mataKuliah', v)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={[]}
                getOptionLabel={(option: any) => option.name}
                filterSelectedOptions
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    variant='outlined'
                    label='Dosen Pengampu Mata Kuliah'
                    placeholder='Pilih Dosen Pengampu Mata Kuliah'
                  />
                )}
                value={watch('dosenPengampu') ?? null}
                onChange={(e, v) => setValue('dosenPengampu', v)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={[]}
                getOptionLabel={(option: any) => option.name}
                filterSelectedOptions
                renderInput={params => (
                  <TextField {...params} required variant='outlined' label='Ruangan' placeholder='Pilih Ruangan' />
                )}
                value={watch('ruangan') ?? null}
                onChange={(e, v) => setValue('ruangan', v)}
              />
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ padding: '24px' }}>
          <Button variant='outlined' color='success'>
            Check Jadwal Kosong
          </Button>
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
            Cancel
          </Button>
          <Button variant='contained' color='success' onClick={() => setIsConfirmationDialogOpen(true)}>
            Submit
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
