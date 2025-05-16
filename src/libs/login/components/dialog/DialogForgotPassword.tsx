import { Icon } from '@iconify/react'
import { DialogTitle, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { ReactElement, Ref, forwardRef } from 'react'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogForgotPassword = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      scroll='body'
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': { border: 'none' }
      }}
    >
      <Box sx={{ padding: '1rem', backgroundColor: 'primary.main', display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton size='small' onClick={() => onClose()} sx={{ color: 'white', flexShrink: '0' }}>
          <Icon icon='material-symbols:close' />
        </IconButton>
      </Box>
      <DialogContent
        sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
        style={{ paddingTop: '5px' }}
      >
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Box borderRadius={999} overflow={'hidden'}>
            <Icon icon='lucide:shield-question' color='#F4CF14' width='80' height='80' style={{ padding: '8px' }} />
          </Box>
          <Typography variant='h5' sx={{ mb: 1, mt: 2, lineHeight: '2rem' }}>
            Forget Password?
          </Typography>
          <Typography variant='body2'>Please contact the developer</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, px: { xs: 8, sm: 15 }, display: 'flex', justifyContent: 'center' }}>
        <Button variant='outlined' color='secondary' type='button' onClick={() => onClose()} className='w-auto'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogForgotPassword
