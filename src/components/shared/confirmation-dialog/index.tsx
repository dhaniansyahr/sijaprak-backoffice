import React from 'react'
import Dialog, { DialogRef } from '../dialog'
import { Box, Button, Grid, Typography } from '@mui/material'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Icon } from '@iconify/react'

interface IDialogConfirmationProps {
  dialogRef: React.RefObject<DialogRef | null>
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  isLoading?: boolean
}

const DialogConfirmation = ({
  dialogRef,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmColor = 'error',
  isLoading = false
}: IDialogConfirmationProps) => {
  const handleConfirm = () => {
    onConfirm?.()
    dialogRef.current?.close()
  }

  const handleCancel = () => {
    onCancel?.()
    dialogRef.current?.close()
  }

  return (
    <Dialog
      isOpen={dialogRef.current?.isOpen ?? false}
      onChange={open => {
        if (!open) {
          dialogRef.current?.close()
        }
      }}
      title={''}
      maxWidth='xs'
      footer={close => (
        <>
          <Button
            onClick={() => {
              handleCancel()
              close()
            }}
            variant='outlined'
            color='inherit'
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} variant='contained' color={confirmColor} disabled={isLoading}>
            {confirmText}
          </Button>
        </>
      )}
    >
      {() => (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '72px',
                  height: '72px',
                  backgroundColor: theme => hexToRGBA(theme.palette.warning.main, 0.12),
                  borderRadius: '100%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon icon='solar:danger-triangle-bold' width={48} color='#FCCF14' />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h5' align='center'>
              {title}
            </Typography>
            <Typography variant='body2' align='center' sx={{ color: '#4C4E6499' }}>
              {message}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Dialog>
  )
}

export default DialogConfirmation
