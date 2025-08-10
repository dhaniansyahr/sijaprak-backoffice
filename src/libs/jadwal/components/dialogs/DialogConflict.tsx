import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { Alert, LoadingButton } from '@mui/lab'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { useCallback } from 'react'

interface DialogConflictProps {
  dialogRef: React.RefObject<IDialogRef>
  onSubmit: () => void
  isLoading: boolean
  errors: any[]
}

const DialogConflict = ({ dialogRef, onSubmit, isLoading, errors }: DialogConflictProps) => {
  const onClose = useCallback(() => {
    dialogRef.current?.close()
  }, [dialogRef])

  return (
    <Dialog
      ref={dialogRef}
      title='Konflik Jadwal Terdeteksi'
      onSubmit={onSubmit}
      customAction={
        <Grid item xs={12}>
          <Box display='flex' gap={4} justifyContent={'center'}>
            <Button variant='contained' color='secondary' size='medium' disabled={isLoading} onClick={onClose}>
              Batal
            </Button>
            <LoadingButton
              loading={isLoading}
              loadingIndicator={<CircularProgress size={20} />}
              type='submit'
              variant='contained'
              disabled={isLoading}
              color='error'
            >
              Ya, Override
            </LoadingButton>
          </Box>
        </Grid>
      }
    >
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
                backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.12),
                borderRadius: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon icon='solar:danger-triangle-bold' width={48} color='#FF4842' />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h5' align='center'>
            Terjadi Konflik Jadwal!
          </Typography>
          <Typography variant='body2' align='center' sx={{ color: '#4C4E6499' }}>
            Jadwal yang akan dibuat konflik dengan jadwal yang sudah ada. Apakah Anda ingin melakukan override untuk
            menimpa jadwal yang sudah ada?
          </Typography>
        </Grid>

        {errors &&
          errors?.map((err: any, idx: number) => (
            <Grid item xs={12} key={idx}>
              <Alert severity='error'>{err?.message}</Alert>
            </Grid>
          ))}
      </Grid>
    </Dialog>
  )
}

export default DialogConflict
