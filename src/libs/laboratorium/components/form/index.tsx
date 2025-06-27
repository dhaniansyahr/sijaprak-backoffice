import { Grid } from '@mui/material'
import React from 'react'
import { Control } from 'react-hook-form'
import { FormTextField } from 'src/components/shared/input/text-field'
import { handleMapErrors } from 'src/utils/response.utils'

interface IFormSectionProps {
  control: Control<any>
  errors: any
  isAssignKepalaLab?: boolean
}

const FormSection = ({ control, errors, isAssignKepalaLab = false }: IFormSectionProps) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <FormTextField
          name='nama'
          label={isAssignKepalaLab ? 'Nama Kepala Lab' : 'Nama Ruangan'}
          placeholder={isAssignKepalaLab ? 'Masukan Nama Kepala Lab' : 'Masukan Nama Ruangan Laboratorium'}
          control={control}
          error={!!handleMapErrors(errors, 'nama')}
          helperText={handleMapErrors(errors, 'nama')}
          rules={{ required: isAssignKepalaLab ? 'Nama Kepala Lab is Required!' : 'Nama Ruangan is Required!' }}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <FormTextField
          name={isAssignKepalaLab ? 'nip' : 'lokasi'}
          label={isAssignKepalaLab ? 'NIP Kepala Lab' : 'Lokasi Ruangan'}
          placeholder={
            isAssignKepalaLab ? 'Masukan NIP Kepala Lab' : 'Masukan Lokasi Ruangan Laboratorium (Ex. Gedung A Lantai 3)'
          }
          control={control}
          error={!!handleMapErrors(errors, isAssignKepalaLab ? 'nip' : 'lokasi')}
          helperText={handleMapErrors(errors, isAssignKepalaLab ? 'nip' : 'lokasi')}
          fullWidth
          rules={{ required: isAssignKepalaLab ? 'NIP Kepala Lab is Required!' : 'Lokasi Ruangan is Required!' }}
        />
      </Grid>
    </Grid>
  )
}

export default FormSection
