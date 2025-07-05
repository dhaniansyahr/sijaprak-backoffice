// React Import
import { useState, memo, useCallback } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// Third Party
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'

// Services & Types
import { TCreateRuanganLaboratorium } from 'src/stores/ruangan/types'
import { useAppDispatch } from 'src/utils/dispatch'
import { IDialogProps } from 'src/utils/response.utils'

// Redux Imports
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'
import { createRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'

// Components
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import ActionDialog from 'src/components/shared/dialog/dialog-action'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import FormSection from '../form'

const Transition = TransitionDialog

interface DialogCreateProps {
  open: boolean
  onClose: () => void
}

const DialogCreateRuanganLaboratorium = memo(({ open, onClose }: DialogCreateProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [errorsResponse, setErrorsResponse] = useState<any>([])

  const { control, reset, handleSubmit, setError } = useForm<TCreateRuanganLaboratorium>({
    defaultValues: {
      nama: '',
      lokasi: ''
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
      setErrorsResponse([])

      try {
        // @ts-ignore
        const res = await dispatch(createRuanganLaboratorium({ data: value }))

        if (res.meta.requestStatus !== 'fulfilled') {
          const errors = res.payload.response.data?.errors || []

          setErrorsResponse(errors)

          errors.forEach((error: any) => {
            setError(error.field, { message: error.message })
          })

          toast.error(errors?.[0]?.message || res.payload.response?.data?.message)

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
    [dispatch, handleClose, setError]
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
      <HeaderDialog
        title='Tambah Ruangan Laboratorium'
        onClose={onClose}
        description='Isi formulir berikut untuk detail Ruangan Laboratorium baru'
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: 5 }}
        >
          <FormSection control={control} errors={errorsResponse} />
        </DialogContent>

        <ActionDialog isLoading={isLoading} onClose={onClose} />
      </form>
    </Dialog>
  )
})

DialogCreateRuanganLaboratorium.displayName = 'DialogCreateRuanganLaboratorium'

export default DialogCreateRuanganLaboratorium
