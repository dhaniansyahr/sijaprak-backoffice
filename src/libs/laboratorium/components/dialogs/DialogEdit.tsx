// React Imports
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

// Third Party Imports
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'

// Component imports
import { LoadingButton } from '@mui/lab'

import { CustomTextField } from 'src/components/templates/custom/CustomTextField'
import { setIsRefresh } from 'src/stores/laboratorium/slice'

// Types
import { TCreateRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useAppDispatch } from 'src/utils/dispatch'
import { useUpdateRuangan } from 'src/stores/laboratorium/service'
import { IDialogProps } from 'src/utils/response.utils'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogEditRuanganLaboratorium = ({ open, onClose, values }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, reset, handleSubmit } = useForm<TCreateRuanganLaboratorium>({
    values: {
      nama: values?.nama,
      lokasi: values?.lokasi
    }
  })

  const { mutate, isUpdating } = useUpdateRuangan()

  const handleClose = () => {
    reset()
    onClose()

    // @ts-ignore
    dispatch(setIsRefresh())
  }

  const onSubmit = handleSubmit(async value => {
    await mutate(value, values?.id)

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
            Edit Ruangan Laboratorium
          </Typography>
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
          <Button variant='contained' color='secondary' disabled={isUpdating} onClick={() => handleClose()}>
            Batal
          </Button>
          <LoadingButton
            loadingIndicator={<CircularProgress size={20} />}
            type='submit'
            loading={isUpdating}
            variant='contained'
            disabled={isUpdating}
          >
            Simpan
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogEditRuanganLaboratorium
