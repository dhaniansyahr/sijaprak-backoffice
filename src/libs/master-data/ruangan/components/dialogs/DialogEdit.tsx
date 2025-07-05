// React Imports
import { useState, memo, useCallback } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// Third Party Imports
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'

// Component imports
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'
import { updateRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'

// Types
import { TCreateRuanganLaboratorium } from 'src/stores/ruangan/types'
import { useAppDispatch } from 'src/utils/dispatch'
import { IDialogProps } from 'src/utils/response.utils'

// Components
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import ActionDialog from 'src/components/shared/dialog/dialog-action'
import FormSection from '../form'

const Transition = TransitionDialog

interface DialogEditProps {
  open: boolean
  onClose: () => void
  values: any
}

const DialogEditRuanganLaboratorium = memo(({ open, onClose, values }: DialogEditProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>([])

  const { control, reset, handleSubmit } = useForm<TCreateRuanganLaboratorium>({
    values: {
      nama: values?.nama || '',
      lokasi: values?.lokasi || ''
    }
  })

  const handleClose = useCallback(() => {
    reset()
    onClose()
    dispatch(setIsRefresh())
  }, [reset, onClose, dispatch])

  const onSubmit: SubmitHandler<TCreateRuanganLaboratorium> = useCallback(
    async value => {
      setIsLoading(true)
      setErrors([])

      try {
        // @ts-ignore
        const res = await dispatch(updateRuanganLaboratorium({ data: value, id: values?.id }))

        if (res.meta.requestStatus !== 'fulfilled') {
          setErrors(res.payload.response.data?.errors || [])
          toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message)

          return
        }

        toast.success(res.payload.message)
        handleClose()
      } catch (error) {
        toast.error('Terjadi kesalahan saat memperbarui data')
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, handleClose, values?.id]
  )

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 0
        }
      }}
    >
      <HeaderDialog title='Edit Ruangan Laboratorium' onClose={onClose} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: 5 }}
        >
          <FormSection control={control} errors={errors} />
        </DialogContent>

        <ActionDialog isLoading={isLoading} onClose={onClose} />
      </form>
    </Dialog>
  )
})

DialogEditRuanganLaboratorium.displayName = 'DialogEditRuanganLaboratorium'

export default DialogEditRuanganLaboratorium
