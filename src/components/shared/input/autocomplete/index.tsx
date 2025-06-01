import { Autocomplete, AutocompleteProps, TextField, TextFieldProps } from '@mui/material'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface FormAutocompleteProps<T extends FieldValues>
  extends Omit<AutocompleteProps<any, boolean, boolean, boolean>, 'renderInput' | 'onChange' | 'value'> {
  name: FieldPath<T>
  control: Control<T>
  rules?: any
  textFieldProps?: Omit<TextFieldProps, 'name'>
}

const FormAutocomplete = <T extends FieldValues>({
  name,
  control,
  rules,
  textFieldProps,
  ...props
}: FormAutocompleteProps<T>) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules
  })

  return (
    <Autocomplete
      {...props}
      renderInput={params => (
        <TextField {...params} {...textFieldProps} error={!!error} helperText={error ? error.message : ''} />
      )}
      value={value}
      onChange={onChange}
      getOptionLabel={option => option.label}
    />
  )
}

export default FormAutocomplete
