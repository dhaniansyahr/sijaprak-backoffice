import { Icon } from '@iconify/react'
import { Box, TextField, TextFieldProps } from '@mui/material'
import React from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const DatePickerInputs = React.forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  return (
    <TextField
      inputRef={ref}
      {...props}
      InputProps={{
        startAdornment: (
          <Box sx={{ display: 'flex', paddingInlineEnd: '8px', color: 'text.secondary' }}>
            <Icon icon='bi:calendar' />
          </Box>
        ),
        ...props.InputProps
      }}
      sx={{
        '& .MuiInputBase-root': {
          cursor: 'pointer'
        },
        ...props.sx
      }}
    />
  )
})

DatePickerInputs.displayName = 'DatePickerInputs'

interface FormDatePickerProps<T extends FieldValues> extends Omit<ReactDatePickerProps, 'selected' | 'onChange'> {
  name: FieldPath<T>
  control: Control<T>
  rules?: any
  label?: string
  placeholder?: string
}

const FormDatePicker = <T extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder,
  ...props
}: FormDatePickerProps<T>) => {
  const {
    field: { onChange, value },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules
  })

  const handleChange = (date: Date | null) => {
    onChange(date)
  }

  return (
    <DatePickerWrapper>
      <ReactDatePicker
        {...props}
        selected={value} // Use 'selected' instead of 'value'
        onChange={handleChange} // Use the wrapper function
        customInput={
          <DatePickerInputs
            fullWidth
            label={label ?? ''}
            placeholder={placeholder ?? ''}
            error={!!error}
            helperText={error ? error.message : ''}
          />
        }
        popperContainer={({ children }) => <Box sx={{ position: 'fixed', zIndex: 9999 }}>{children}</Box>}
      />
    </DatePickerWrapper>
  )
}

export default FormDatePicker
