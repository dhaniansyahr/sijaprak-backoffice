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
import Dialog, { DialogRef } from 'src/components/shared/dialog'
import { Box, Button, CircularProgress, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

interface IDialogAssignKepalaLab {
  dialogRef: React.RefObject<DialogRef>
  values: any
}

const DialogAssignKepalaLab = memo(({ dialogRef, values }: IDialogAssignKepalaLab) => {
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
      isOpen={dialogRef.current?.isOpen ?? false}
      onChange={open => {
        if (!open) {
          dialogRef.current?.close()
        }
      }}
      title='Pergantian Kepala Laboratorium'
      maxWidth='md'
      fullWidth
    >
      {close => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormSection control={control} errors={errors} isAssignKepalaLab={true} />
            </Grid>

            <Grid item xs={12}>
              <Box display='flex' gap={4}>
                <Button variant='contained' color='secondary' size='medium' disabled={isLoading} onClick={close}>
                  Batal
                </Button>
                <LoadingButton
                  loading={isLoading}
                  loadingIndicator={<CircularProgress size={20} />}
                  type='submit'
                  variant='contained'
                  disabled={isLoading}
                  color='error'
                >
                  Submit
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Dialog>
  )
})

DialogAssignKepalaLab.displayName = 'DialogAssignKepalaLab'

export default DialogAssignKepalaLab
