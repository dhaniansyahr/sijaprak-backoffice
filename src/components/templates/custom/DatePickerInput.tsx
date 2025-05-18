import { Icon } from '@iconify/react'
import { Box, TextField } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'

interface DatePickerProps {
  placeholderText: string
  label: string
  errorMessage?: string
  errorState?: boolean
}

const DatePickerInputs = forwardRef(
  ({ placeholderText, label, errorMessage, errorState }: DatePickerProps, ref: ForwardedRef<HTMLElement>) => {
    return (
      <TextField
        inputRef={ref}
        label={label}
        placeholder={placeholderText}
        error={errorState}
        helperText={errorMessage}
        fullWidth
        InputProps={{
          startAdornment: (
            <Box sx={{ display: 'flex', paddingInlineEnd: '5px', color: 'rgba(76, 78, 100, 0.54)' }}>
              <Icon icon='bi:calendar' />
            </Box>
          )
        }}
      />
    )
  }
)

export default DatePickerInputs
