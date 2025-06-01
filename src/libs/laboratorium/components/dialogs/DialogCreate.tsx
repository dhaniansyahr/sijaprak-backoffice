// React Import
import React from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'

// Third Party
import { useForm } from 'react-hook-form'

// Services & Types
import { TCreateRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useAppDispatch } from 'src/utils/dispatch'
import { IDialogProps } from 'src/utils/response.utils'

// Redux Imports
import { setIsRefresh } from 'src/stores/laboratorium/slice'
import { useCreateRuangan } from 'src/stores/laboratorium/service'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import { FormTextField } from 'src/components/shared/input/text-field'
import ActionDialog from 'src/components/shared/dialog/dialog-action'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'

const Transition = TransitionDialog

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
      <HeaderDialog
        title='Tambah Ruangan Laboratorium'
        onClose={onClose}
        description='Isi formulir berikut untuk detail Ruangan Laboratorium baru'
      />

      <form onSubmit={onSubmit}>
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: '5px' }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormTextField
                name='nama'
                label='Nama Ruangan'
                placeholder='Masukan Nama Ruangan Laboratorium'
                control={control}
                rules={{ required: 'Nama Ruangan is Required!' }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextField
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

        <ActionDialog isLoading={isCreating} onClose={onClose} />
      </form>
    </Dialog>
  )
}

export default DialogCreateRuanganLaboratorium
