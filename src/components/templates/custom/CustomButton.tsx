import React from 'react'
import { Button, ButtonProps, CircularProgress } from '@mui/material'

export interface CustomButtonProps extends ButtonProps {
  loading?: boolean
  loadingPosition?: 'start' | 'end' | 'center'
}

/**
 * CustomButton - A custom MUI Button component with loading state
 *
 * Extends the standard MUI Button with loading functionality
 */
const CustomButton: React.FC<CustomButtonProps> = ({
  loading = false,
  children,
  disabled = false,
  loadingPosition = 'center',
  startIcon,
  endIcon,
  onClick,
  ...buttonProps
}) => {
  // Size for the loading indicator - use proper type safety
  const spinnerSize = buttonProps.size === 'small' ? 16 : buttonProps.size === 'large' ? 26 : 20

  // Determine the content based on loading state and position
  const renderContent = () => {
    if (!loading) {
      return (
        <>
          {startIcon}
          {children}
          {endIcon}
        </>
      )
    }

    if (loadingPosition === 'start') {
      return (
        <>
          <CircularProgress size={spinnerSize} color='inherit' sx={{ mr: 1 }} />
          {children}
          {endIcon}
        </>
      )
    }

    if (loadingPosition === 'end') {
      return (
        <>
          {startIcon}
          {children}
          <CircularProgress size={spinnerSize} color='inherit' sx={{ ml: 1 }} />
        </>
      )
    }

    // For center position, replace children with spinner
    return <CircularProgress size={spinnerSize} color='inherit' />
  }

  return (
    <Button
      disabled={loading || disabled}
      onClick={!loading ? onClick : undefined}
      sx={{
        position: 'relative',

        // For consistent width during loading state
        ...(loading &&
          loadingPosition === 'center' && {
            '& .MuiButton-startIcon, & .MuiButton-endIcon': {
              visibility: 'hidden'
            }
          }),
        ...(buttonProps.sx || {})
      }}
      startIcon={startIcon}
      endIcon={endIcon}
      {...buttonProps}
    >
      {renderContent()}
    </Button>
  )
}

export default CustomButton
