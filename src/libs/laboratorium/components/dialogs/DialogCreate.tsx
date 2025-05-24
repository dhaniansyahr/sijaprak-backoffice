// React Import
import React, { ReactElement, Ref, forwardRef, useState } from 'react'

// MUI Imports
import { CircularProgress, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { LoadingButton } from '@mui/lab'

// Third Party
import { Icon } from '@iconify/react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// Component Imports
import { CustomTextField } from 'src/components/templates/custom/CustomTextField'

// Services & Types
import { TCreateRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useAppDispatch } from 'src/utils/dispatch'
import { IDialogProps } from 'src/utils/response.utils'

// Redux Imports
import { setIsRefresh } from 'src/stores/laboratorium/slice'
import { useCreateRuangan } from 'src/stores/laboratorium/service'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogCreateRuanganLaboratorium = ({ open, onClose }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, reset, handleSubmit } = useForm<TCreateRuanganLaboratorium>({
    defaultValues: {
      nama: '',
      lokasi: ''
    }
  })

  const { mutate, isCreating } = useCreateRuangan()

  const handleClose = () => {
    reset()
    onClose()

    dispatch(setIsRefresh())
  }

  const onSubmit = handleSubmit(async value => {
    await mutate(value)

    handleClose()
  })

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: '0px'
        }
      }}
    >
      <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: 'primary.dark' }}>
        <IconButton
          onClick={() => {
            handleClose()
          }}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='material-symbols:close' color='white' />
        </IconButton>
        <Box>
          <Typography variant='h5' color={'white'}>
            Tambah Ruangan Laboratorium
          </Typography>
          <Typography color={'white'}>Isi formulir berikut untuk detail Ruangan Laboratorium baru</Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: '5px' }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CustomTextField
                name='nama'
                label='Nama Ruangan'
                placeholder='Masukan Nama Ruangan Laboratorium'
                control={control}
                rules={{ required: 'Nama Ruangan is Required!' }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                name='lokasi'
                label='Lokasi Ruangan'
                placeholder='Masukan Lokasi Ruangan Laboratorium (Ex. Gedung A Lantai 3)'
                control={control}
                fullWidth
                rules={{ required: 'Lokasi Ruangan is Required!' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'end', px: { xs: 8, sm: 15 } }}>
          <Button variant='contained' color='secondary' disabled={isCreating} onClick={() => handleClose()}>
            Batal
          </Button>
          <LoadingButton
            loadingIndicator={<CircularProgress size={20} />}
            type='submit'
            loading={isCreating}
            variant='contained'
            disabled={isCreating}
          >
            Simpan
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogCreateRuanganLaboratorium
