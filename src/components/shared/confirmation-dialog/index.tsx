import React from 'react'
import Dialog, { IDialogRef } from '../dialog'
import { Box, Grid, Typography } from '@mui/material'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Icon } from '@iconify/react'

interface IDialogConfirmationProps {
  dialogRef: React.RefObject<IDialogRef>
  title?: string
  message?: string
  onConfirm?: () => void
  isLoading?: boolean
}

const DialogConfirmation = ({
  dialogRef,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  onConfirm,
  isLoading = false
}: IDialogConfirmationProps) => {
  return (
    <Dialog ref={dialogRef} title={'Konfirmasi'} onSubmit={onConfirm} isLoading={isLoading}>
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
    </Dialog>
  )
}

export default DialogConfirmation
