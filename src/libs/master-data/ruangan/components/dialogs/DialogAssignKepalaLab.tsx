// React Imports
import { useState, memo, useCallback } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// Third Party Imports
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'

// Redux & Types
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'
import { useAppDispatch } from 'src/utils/dispatch'
import { assignKepalaLab } from 'src/stores/master-data/ruangan/action'

// Components
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import ActionDialog from 'src/components/shared/dialog/dialog-action'
import FormSection from '../form'

const Transition = TransitionDialog

interface IDialogAssignKepalaLab {
  open: boolean
  onClose: () => void
  values: any
}

const DialogAssignKepalaLab = memo(({ open, onClose, values }: IDialogAssignKepalaLab) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>([])

  const { control, reset, handleSubmit } = useForm<any>({
    values: {
      nama: values?.namaKepalaLab || '',
      nip: values?.nipKepalaLab || ''
    }
  })

  const handleClose = useCallback(() => {
    setIsLoading(false)
    reset()
    onClose()
    dispatch(setIsRefresh())
  }, [reset, onClose, dispatch])

  const onSubmit: SubmitHandler<any> = useCallback(
    async value => {
      setIsLoading(true)
      setErrors([])

      try {
        // @ts-ignore
        const res = await dispatch(assignKepalaLab({ data: value, id: values?.id }))

        if (res.meta.requestStatus !== 'fulfilled') {
          setErrors(res.payload.response.data?.errors || [])
          toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message)

          return
        }

        toast.success(res.payload.message)
        handleClose()
      } catch (error) {
        toast.error('Terjadi kesalahan saat menyimpan data')
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
      <HeaderDialog title='Pergantian Kepala Laboratorium' onClose={onClose} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: 5 }}
        >
          <FormSection control={control} errors={errors} isAssignKepalaLab={true} />
        </DialogContent>

        <ActionDialog isLoading={isLoading} onClose={onClose} />
      </form>
    </Dialog>
  )
})

DialogAssignKepalaLab.displayName = 'DialogAssignKepalaLab'

export default DialogAssignKepalaLab
