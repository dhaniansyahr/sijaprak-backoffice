import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { ReactElement, Ref, forwardRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface DialogConfirmationProps {
  open: boolean
  onClose: (v: boolean) => void
  values: any
}

const DialogConfirmation = ({ open, onClose, values }: DialogConfirmationProps) => {
  // const dispatch: AppDispatch = useDispatch()

  const [isLoading, setIsLoading] = useState<any>(false)

  const handleClose = () => {
    setIsLoading(false)
    onClose(false)

    // @ts-ignore
    // dispatch(setIsRefresh())
  }

  // const handleCreate = async () => {
  //   setIsLoading(true)
  //   toast.loading('Loading...')

  //   if (type === 'CREATE') {
  //     // @ts-ignore
  //     await dispatch(createMarketInformation({ data: values })).then(res => {
  //       if (res?.meta?.requestStatus !== 'fulfilled') {
  //         setIsLoading(false)
  //         toast.dismiss()
  //         toast.error(res?.payload?.response?.data?.message)

  //         return
  //       }

  //       setIsLoading(false)
  //       toast.dismiss()
  //       toast.success(res?.payload?.message)
  //       handleClose()
  //       onCloseDrawer()
  //     })
  //   } else {
  //     // @ts-ignore
  //     await dispatch(updateMarketInformation({ data: values, id: id })).then(res => {
  //       if (res?.meta?.requestStatus !== 'fulfilled') {
  //         setIsLoading(false)
  //         toast.dismiss()
  //         toast.error(res?.payload?.response?.data?.message)

  //         return
  //       }

  //       setIsLoading(false)
  //       toast.dismiss()
  //       toast.success(res?.payload?.message)
  //       handleClose()
  //       onCloseDrawer()
  //     })
  //   }
  // }

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
      <Box
        sx={{
          py: 4,
          px: { xs: 8, sm: 10 },
          backgroundColor: 'primary.main',
          display: 'flex',
          justifyContent: 'end',
          marginBottom: '30px'
        }}
      >
        <IconButton size='small' onClick={() => handleClose()} sx={{ color: 'white', flexShrink: '0' }}>
          <Icon icon='material-symbols:close' width={24} color='#fff' />
        </IconButton>
      </Box>

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
              Maaf Kuota untuk Asisten sudah penuh!!
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center', px: { xs: 8, sm: 10 } }}>
        <Button variant='contained' color='primary' disabled={isLoading}>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogConfirmation
