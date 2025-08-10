// React Imports
import React, { useState, memo, useCallback } from 'react'

// Third Party Imports
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'

// Redux & Types
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'
import { useAppDispatch } from 'src/utils/dispatch'
import { assignKepalaLab } from 'src/stores/master-data/ruangan/action'

// Components
import FormSection from '../form'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'

interface IDialogChangeProps {
  dialogRef: React.RefObject<IDialogRef>
  values: any
}

const DialogChange = memo(({ dialogRef, values }: IDialogChangeProps) => {
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

    dialogRef.current?.close()
    dispatch(setIsRefresh())
  }, [reset, dialogRef, dispatch])

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
      ref={dialogRef}
      title='Pergantian Kepala Laboratorium'
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <FormSection control={control} errors={errors} isAssignKepalaLab={true} />
    </Dialog>
  )
})

DialogChange.displayName = 'DialogChange'

export default DialogChange
