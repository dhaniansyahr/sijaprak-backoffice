import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  TextField
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import DialogConfirmation from '../components/dialogs/DialogConfirmation'
import HeaderPage from 'src/components/shared/header-page'
import FormAutocomplete from 'src/components/shared/input/autocomplete'
import { useGetAllShifts } from 'src/stores/shift/service'
import { useGetFreeJadwal } from '../hooks/useGetFreeJadwal'
import { LoadingButton } from '@mui/lab'

const hariOptions = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU']

export default function CreateJadwal() {
  const { watch, setValue, control } = useForm()

  const { data: shifts, isLoadTable: isLoadShifts } = useGetAllShifts(true, { page: 1, rows: 1000000 })

  const { data: freeJadwal, isLoading: isLoadFreeJadwal, columns, handleGetFreeJadwal } = useGetFreeJadwal()

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false)

  return (
    <Fragment>
      <Card sx={{ mb: 4 }}>
        <HeaderPage icon='meteor-icons:arrow-left' title='Tambah Jadwal Praktikum Baru' />
      </Card>

      <Card sx={{ padding: '16px' }}>
        <CardContent sx={{ padding: '24px' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <FormAutocomplete
                name='hari'
                options={hariOptions}
                getOptionLabel={option => option}
                control={control}
                placeholder='Pilih Hari'
                label='Hari'
                fullWidth
                rules={{
                  require: 'Hari is Required!'
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormAutocomplete
                loading={isLoadShifts}
                options={shifts?.entries || []}
                getOptionLabel={option => `${option.startTime} - ${option.endTime}`}
                name='shiftId'
                label='Shift'
                placeholder='Pilih Shift'
                control={control}
                rules={{
                  require: 'Shift is Required!'
                }}
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
          <LoadingButton
            variant='outlined'
            color='success'
            onClick={handleGetFreeJadwal}
            loading={isLoadFreeJadwal}
            loadingIndicator={<CircularProgress size={20} />}
          >
            Daftar Jadwal Kosong
          </LoadingButton>
        </CardContent>

        <Divider />

        <CardContent sx={{ padding: '24px' }}>
          <DataGrid
            autoHeight
            rows={freeJadwal?.freeScheduleSlots || []}
            columns={columns}
            pagination
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            hideFooter
            loading={isLoadFreeJadwal}
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
