import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { LoadingButton } from '@mui/lab'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Dialog, { DialogRef } from 'src/components/shared/dialog'
import { useCallback } from 'react'

interface DialogConflictProps {
  dialogRef: React.RefObject<DialogRef>
  onSubmit: () => Promise<void>
  isLoading: boolean
}

const DialogConflict = ({ dialogRef, onSubmit, isLoading }: DialogConflictProps) => {
  const onClose = useCallback(() => {
    dialogRef.current?.close()
  }, [dialogRef])

  return (
    <Dialog
      ref={dialogRef}
      isOpen={dialogRef.current?.isOpen ?? false}
      onChange={open => {
        if (!open) {
          dialogRef.current?.close()
        }
      }}
      title='Konflik Jadwal Terdeteksi'
      maxWidth='sm'
      fullWidth
    >
      {() => (
        <form
          action='submit'
          onSubmit={e => {
            e.preventDefault()

            onSubmit()
          }}
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
                Jadwal Bentrok Terdeteksi!
              </Typography>
              <Typography variant='body2' align='center' sx={{ color: '#4C4E6499' }}>
                Jadwal yang akan dibuat bentrok dengan jadwal yang sudah ada. Apakah Anda ingin melakukan override untuk
                menimpa jadwal yang sudah ada?
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box display='flex' gap={4}>
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
          </Grid>
        </form>
      )}
    </Dialog>
  )
}

export default DialogConflict
