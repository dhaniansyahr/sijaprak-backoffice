import React, { useState } from 'react'
import { TextField, InputAdornment } from '@mui/material'

interface InputMaskProps {
  type: 'email' | 'phone' | 'currency'
  value: string
  onChange: (value: string, isValid: boolean) => void
  label?: string
  placeholder?: string
  required?: boolean
  fullWidth?: boolean
  variant?: 'standard' | 'filled' | 'outlined'
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
  autoFocus?: boolean
  size?: 'small' | 'medium'
}

export const InputMask: React.FC<InputMaskProps> = ({
  type,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  fullWidth = false,
  variant = 'outlined',
  icon,
  className,
  disabled = false,
  autoFocus = false,
  size = 'medium'
}) => {
  const [error, setError] = useState<string | null>(null)
  const [internalValue, setInternalValue] = useState<string>(value || '')

  // Update internal value when external value changes
  React.useEffect(() => {
    setInternalValue(value || '')
  }, [value])

  // Email validation
  const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    return regex.test(email)
  }

  // Phone validation and formatting
  const formatPhoneNumber = (input: string): string => {
    // Remove all non-digits
    const digitsOnly = input.replace(/\D/g, '')

    // Format based on number of digits
    if (digitsOnly.length >= 11 && digitsOnly.length <= 13) {
      return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 8)}-${digitsOnly.slice(8)}`
    } else {
      return digitsOnly
    }
  }

  const validatePhone = (phone: string): boolean => {
    // Check if it has the right number of digits after removing formatting
    const digitsOnly = phone.replace(/\D/g, '')

    return digitsOnly.length === 11 || digitsOnly.length === 12 || digitsOnly.length === 13
  }

  // Currency validation and formatting
  const formatCurrency = (input: string): string => {
    // Remove all non-digits and non-decimal points
    let value = input.replace(/[^\d.]/g, '')

    // Ensure only one decimal point
    const parts = value.split('.')
    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join('')}`
    }

    // Add thousand separators and format decimals
    const numParts = value.split('.')
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Ensure two decimal places
    if (numParts.length > 1) {
      // Limit to two decimal places
      numParts[1] = numParts[1].slice(0, 2)

      return numParts.join('.')
    }

    return value
  }

  const validateCurrency = (currency: string): boolean => {
    // Basic validation - should have at least one digit
    return /\d/.test(currency)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    let formattedValue = input
    let isValid = false

    switch (type) {
      case 'email':
        isValid = validateEmail(input)
        setError(input && !isValid ? 'Please enter a valid email address' : null)
        formattedValue = input
        break

      case 'phone':
        formattedValue = formatPhoneNumber(input)
        isValid = validatePhone(formattedValue)
        setError(input && !isValid ? 'Please enter a valid phone number' : null)
        break

      case 'currency':
        formattedValue = formatCurrency(input)
        isValid = validateCurrency(formattedValue)
        setError(input && !isValid ? 'Please enter a valid amount' : null)
        break
    }

    setInternalValue(formattedValue)
    onChange(formattedValue, isValid)
  }

  // Different input configurations based on type
  const getInputProps = () => {
    switch (type) {
      case 'email':
        return {
          type: 'email',
          inputMode: 'email' as React.HTMLAttributes<HTMLInputElement>['inputMode'],
          startAdornment: icon ? <InputAdornment position='start'>{icon}</InputAdornment> : undefined
        }
      case 'phone':
        return {
          type: 'tel',
          inputMode: 'tel' as React.HTMLAttributes<HTMLInputElement>['inputMode'],
          startAdornment: icon ? <InputAdornment position='start'>{icon}</InputAdornment> : undefined
        }
      case 'currency':
        return {
          type: 'text',
          inputMode: 'decimal' as React.HTMLAttributes<HTMLInputElement>['inputMode'],
          startAdornment: icon ? (
            <InputAdornment position='start'>{icon}</InputAdornment>
          ) : (
            <InputAdornment position='start'>Rp. </InputAdornment>
          )
        }
      default:
        return {}
    }
  }

  return (
    <TextField
      label={label}
      value={internalValue}
      onChange={handleChange}
      error={!!error}
      helperText={error}
      required={required}
      fullWidth={fullWidth}
      variant={variant}
      className={className}
      disabled={disabled}
      autoFocus={autoFocus}
      size={size}
      placeholder={placeholder}
      InputProps={getInputProps()}
    />
  )
}
