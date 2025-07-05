import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { LoadingButton } from '@mui/lab'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'

const Transition = TransitionDialog

interface DialogConflictProps {
  open: boolean
  onClose: () => void
  onSubmit: () => Promise<void>
  isLoading: boolean
}

const DialogConflict = ({ open, onClose, onSubmit, isLoading }: DialogConflictProps) => {
  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      scroll='body'
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': { border: 'none', borderRadius: '0px' }
      }}
    >
      <HeaderDialog onClose={onClose} title='Konflik Jadwal Terdeteksi' />

      <form
        action='submit'
        onSubmit={e => {
          e.preventDefault()

          onSubmit()
        }}
      >
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 10 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: '5px' }}
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
          </Grid>
        </DialogContent>

        <DialogActions sx={{ pb: { xs: 8, sm: 10 }, justifyContent: 'end', px: { xs: 8, sm: 15 } }}>
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
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogConflict
