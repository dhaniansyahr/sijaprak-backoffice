import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { Controller, Control, Path, FieldValues, RegisterOptions } from 'react-hook-form'

// Create interface that extends TextFieldProps and adds our custom props
export interface FormTextFieldProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  rules?: RegisterOptions
  helperTextOnError?: string
}

/**
 * CustomTextField - A reusable TextField component that extends MUI TextField
 * and integrates with React Hook Form
 */
export function FormTextField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperTextOnError,
  ...textFieldProps
}: FormTextFieldProps<TFieldValues>): JSX.Element {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          value={field.value ?? ''}
          onChange={e => {
            field.onChange(e)
            if (textFieldProps.onChange) {
              textFieldProps.onChange(e)
            }
          }}
          onBlur={e => {
            field.onBlur()
            if (textFieldProps.onBlur) {
              textFieldProps.onBlur(e)
            }
          }}
          error={!!error}
          helperText={error ? helperTextOnError || error.message : textFieldProps.helperText}
        />
      )}
    />
  )
}
