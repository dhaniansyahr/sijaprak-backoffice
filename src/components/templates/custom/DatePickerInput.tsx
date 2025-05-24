import { Icon } from '@iconify/react'
import { Box, TextField, TextFieldProps } from '@mui/material'
import React from 'react'

export const DatePickerInputs = React.forwardRef((props: TextFieldProps, ref: React.ForwardedRef<HTMLElement>) => {
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
