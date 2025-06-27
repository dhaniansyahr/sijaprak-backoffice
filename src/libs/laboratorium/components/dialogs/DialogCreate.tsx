// React Import
import React, { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

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
import ActionDialog from 'src/components/shared/dialog/dialog-action'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import FormSection from '../form'
import { createRuanganLaboratorium } from 'src/stores/laboratorium/action'
import toast from 'react-hot-toast'

const Transition = TransitionDialog

const DialogCreateRuanganLaboratorium = ({ open, onClose }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>([])

  const { control, reset, handleSubmit } = useForm<TCreateRuanganLaboratorium>({
    defaultValues: {
      nama: '',
      lokasi: ''
    }
  })

  const handleClose = () => {
    reset()
    onClose()

    dispatch(setIsRefresh())
  }

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(createRuanganLaboratorium({ data: value })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)
        setErrors(res.payload.response.data?.errors)
        toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message)

        return
      }

      setIsLoading(false)
      toast.success(res.payload.message)
      handleClose()
    })
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
          <FormSection control={control} errors={errors} />
        </DialogContent>

        <ActionDialog isLoading={isLoading} onClose={onClose} />
      </form>
    </Dialog>
  )
}

export default DialogCreateRuanganLaboratorium
