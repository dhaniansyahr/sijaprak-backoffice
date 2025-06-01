// React Imports
import React from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'

// Third Party Imports
import { useForm } from 'react-hook-form'

// Component imports
import { setIsRefresh } from 'src/stores/laboratorium/slice'

// Types
import { TCreateRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useAppDispatch } from 'src/utils/dispatch'
import { useUpdateRuangan } from 'src/stores/laboratorium/service'
import { IDialogProps } from 'src/utils/response.utils'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import { FormTextField } from 'src/components/shared/input/text-field'
import ActionDialog from 'src/components/shared/dialog/dialog-action'

const Transition = TransitionDialog

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
      <HeaderDialog title='Edit Ruangan Laboratorium' onClose={onClose} />

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

        <ActionDialog isLoading={isUpdating} onClose={onClose} />
      </form>
    </Dialog>
  )
}

export default DialogEditRuanganLaboratorium
