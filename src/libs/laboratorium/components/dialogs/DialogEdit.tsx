// React Imports
import React, { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// Third Party Imports
import { useForm } from 'react-hook-form'

// Component imports
import { setIsRefresh } from 'src/stores/laboratorium/slice'

// Types
import { TCreateRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useAppDispatch } from 'src/utils/dispatch'
import { IDialogProps } from 'src/utils/response.utils'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import ActionDialog from 'src/components/shared/dialog/dialog-action'
import FormSection from '../form'
import toast from 'react-hot-toast'
import { updateRuanganLaboratorium } from 'src/stores/laboratorium/action'

const Transition = TransitionDialog

const DialogEditRuanganLaboratorium = ({ open, onClose, values }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>([])

  const { control, reset, handleSubmit } = useForm<TCreateRuanganLaboratorium>({
    values: {
      nama: values?.nama,
      lokasi: values?.lokasi
    }
  })

  const handleClose = () => {
    reset()
    onClose()

    // @ts-ignore
    dispatch(setIsRefresh())
  }

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(updateRuanganLaboratorium({ data: value, id: values?.id })).then(res => {
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

    setIsLoading(false)
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
          <FormSection control={control} errors={errors} />
        </DialogContent>

        <ActionDialog isLoading={isLoading} onClose={onClose} />
      </form>
    </Dialog>
  )
}

export default DialogEditRuanganLaboratorium
