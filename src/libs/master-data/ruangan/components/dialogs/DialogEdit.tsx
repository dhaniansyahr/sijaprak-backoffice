// React Imports
import { useState, memo, useCallback } from 'react'

// Third Party Imports
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'

// Component imports
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'
import { updateRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'

// Types
import { useAppDispatch } from 'src/utils/dispatch'

// Components
import FormSection from '../form'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'

interface DialogEditProps {
  dialogRef: React.RefObject<IDialogRef>
  values: any
}

const DialogEdit = memo(({ dialogRef, values }: DialogEditProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>([])

  const { control, reset, handleSubmit } = useForm<any>({
    values: {
      nama: values?.nama || '',
      lokasi: values?.lokasi || '',
      kapasitas: values?.kapasitas || ''
    }
  })

  const handleClose = useCallback(() => {
    reset()

    dialogRef.current?.close()
    dispatch(setIsRefresh())
  }, [reset, dialogRef, dispatch])

  const onSubmit: SubmitHandler<any> = useCallback(
    async value => {
      setIsLoading(true)
      setErrors([])

      try {
        const body = Object.assign({}, value, { kapasitas: Number(value?.kapasitas) })

        // @ts-ignore
        const res = await dispatch(updateRuanganLaboratorium({ data: body, id: values?.id }))

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
    <Dialog ref={dialogRef} title='Edit Ruangan Laboratorium' onSubmit={handleSubmit(onSubmit)} isLoading={isLoading}>
      <FormSection control={control} errors={errors} />
    </Dialog>
  )
})

DialogEdit.displayName = 'DialogEdit'

export default DialogEdit
