// React Import
import React, { useState, memo, useCallback } from 'react'

// Third Party
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'

// Services & Types
import { useAppDispatch } from 'src/utils/dispatch'

// Redux Imports
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'
import { createRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'

// Components
import FormSection from '../form'
import Dialog, { DialogRef } from 'src/components/shared/dialog'
import { Box, Button, CircularProgress, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

interface DialogCreateProps {
  dialogRef: React.RefObject<DialogRef>
}

const DialogCreateRuanganLaboratorium = memo(({ dialogRef }: DialogCreateProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [errorsResponse, setErrorsResponse] = useState<any>([])

  const { control, reset, handleSubmit, setError } = useForm<any>({
    defaultValues: {
      nama: '',
      lokasi: ''
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
      ref={dialogRef}
      fullWidth
      isOpen={dialogRef.current?.isOpen ?? false}
      onChange={open => {
        if (!open) {
          dialogRef.current?.close()
        }
      }}
      title='Tambah Ruangan Laboratorium'
      maxWidth='md'
    >
      {close => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormSection control={control} errors={errorsResponse} />
            </Grid>

            <Grid item xs={12}>
              <Box display='flex' justifyContent={'flex-end'} gap={4}>
                <Button variant='contained' color='secondary' size='medium' disabled={isLoading} onClick={close}>
                  Batal
                </Button>
                <LoadingButton
                  loading={isLoading}
                  loadingIndicator={<CircularProgress size={20} />}
                  type='submit'
                  variant='contained'
                  disabled={isLoading}
                  color='primary'
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

DialogCreateRuanganLaboratorium.displayName = 'DialogCreateRuanganLaboratorium'

export default DialogCreateRuanganLaboratorium
