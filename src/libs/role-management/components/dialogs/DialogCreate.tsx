import { Icon } from '@iconify/react'
import { DialogTitle, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogCreate = ({ open, onClose }: any) => {
  const { watch, setValue, reset } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
  }

  return (
    <Dialog fullWidth open={open} maxWidth='sm' scroll='body' TransitionComponent={Transition}>
      <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: 'primary.main' }}>
        <IconButton
          onClick={() => {
            handleClose()
          }}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='material-symbols:close' color='white' />
        </IconButton>
        <Box>
          <Typography variant='h5' sx={{ color: 'white' }}>
            Tambah Role
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
        style={{ paddingTop: '5px' }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label='Nama Role'
              placeholder='Masukan Nama Role'
              value={watch('nama') ?? ''}
              onChange={(e: any) => {
                setValue('nama', e.target.value)
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'end', px: { xs: 8, sm: 15 } }}>
        <Button variant='contained' color='secondary' disabled={isLoading} onClick={() => handleClose()}>
          Batal
        </Button>
        <Button type='submit' variant='contained' disabled={isLoading}>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogCreate
