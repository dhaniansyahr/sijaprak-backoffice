import { Grid } from '@mui/material'
import { memo } from 'react'
import { Control } from 'react-hook-form'
import { FormTextField } from 'src/components/shared/input/text-field'
import { handleMapErrors } from 'src/utils/response.utils'

interface IFormSectionProps {
  control: Control<any>
  errors: any
  isAssignKepalaLab?: boolean
}

const FormSection = memo(({ control, errors, isAssignKepalaLab = false }: IFormSectionProps) => {
  const nameField = isAssignKepalaLab ? 'nama' : 'nama'
  const secondField = isAssignKepalaLab ? 'nip' : 'lokasi'

  const nameLabel = isAssignKepalaLab ? 'Nama Kepala Lab' : 'Nama Ruangan'
  const namePlaceholder = isAssignKepalaLab ? 'Masukan Nama Kepala Lab' : 'Masukan Nama Ruangan Laboratorium'
  const nameRequired = isAssignKepalaLab ? 'Nama Kepala Lab is Required!' : 'Nama Ruangan is Required!'

  const secondLabel = isAssignKepalaLab ? 'NIP Kepala Lab' : 'Lokasi Ruangan'
  const secondPlaceholder = isAssignKepalaLab
    ? 'Masukan NIP Kepala Lab'
    : 'Masukan Lokasi Ruangan Laboratorium (Ex. Gedung A Lantai 3)'
  const secondRequired = isAssignKepalaLab ? 'NIP Kepala Lab is Required!' : 'Lokasi Ruangan is Required!'

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <FormTextField
          name={nameField}
          label={nameLabel}
          placeholder={namePlaceholder}
          control={control}
          error={!!handleMapErrors(errors, nameField)}
          helperText={handleMapErrors(errors, nameField)}
          rules={{ required: nameRequired }}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <FormTextField
          name={secondField}
          label={secondLabel}
          placeholder={secondPlaceholder}
          control={control}
          error={!!handleMapErrors(errors, secondField)}
          helperText={handleMapErrors(errors, secondField)}
          fullWidth
          rules={{ required: secondRequired }}
        />
      </Grid>
    </Grid>
  )
})

FormSection.displayName = 'FormSection'

export default FormSection
