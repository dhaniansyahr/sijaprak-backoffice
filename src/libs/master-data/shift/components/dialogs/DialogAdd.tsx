// React Imports
import { useCallback, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { useAppDispatch } from 'src/utils/dispatch'
import { setIsRefresh } from 'src/stores/master-data/shift/slice'
import toast from 'react-hot-toast'
import { handleMapErrors, IDialogProps } from 'src/utils/response.utils'
import FormDatePicker from 'src/components/shared/input/date'
import { Button, CircularProgress, Typography } from '@mui/material'
import { createShift } from 'src/stores/master-data/shift/action'
import Dialog, { DialogRef } from 'src/components/shared/dialog'
import LoadingButton from '@mui/lab/LoadingButton'

interface DialogAddProps {
  ref: React.RefObject<DialogRef>
}

const DialogAdd = ({ ref }: DialogAddProps) => {
  const dispatch = useAppDispatch()

  const { control, reset, handleSubmit, setError } = useForm<any>({
    defaultValues: {
      startTime: null,
      endTime: null
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>([])

  const handleClose = useCallback(() => {
    setIsLoading(false)
    reset()
    ref.current?.close()

    // @ts-ignore
    dispatch(setIsRefresh())
  }, [reset, ref, dispatch])

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)

    const body = {
      startTime: moment(value.startTime).format('HH:mm'),
      endTime: moment(value.endTime).format('HH:mm')
    }

    // @ts-ignore
    await dispatch(createShift({ data: body })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)
        const errors = res.payload.response.data?.errors || []

        setErrors(errors)

        errors.forEach((error: any) => {
          setError(error.field, { message: error.message })
        })

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
      isOpen={ref.current?.isOpen ?? false}
      onChange={open => {
        if (!open) {
          ref.current?.close()
        }
      }}
      maxWidth='md'
      title='Tambah Shift'
    >
      {close => (
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <FormDatePicker
                name='startTime'
                control={control}
                rules={{ required: 'Waktu mulai tidak boleh kosong' }}
                showTimeSelect
                showTimeSelectOnly
                label='Start Time'
                placeholder='HH:mm'
                dateFormat='HH:mm'
                popperContainer={({ children }) => <Box sx={{ position: 'fixed', zIndex: 99999 }}>{children}</Box>}
              />
              {!!handleMapErrors(errors, 'startTime') && (
                <Typography color='error'>{handleMapErrors(errors, 'startTime')}</Typography>
              )}
            </Grid>

            <Grid item xs={6}>
              <FormDatePicker
                name='endTime'
                control={control}
                label='End Time'
                placeholder='HH:mm'
                rules={{ required: 'Waktu selesai tidak boleh kosong' }}
                showTimeSelect
                showTimeSelectOnly
                dateFormat='HH:mm'
                popperContainer={({ children }) => <Box sx={{ position: 'fixed', zIndex: 99999 }}>{children}</Box>}
              />
              {!!handleMapErrors(errors, 'endTime') && (
                <Typography color='error'>{handleMapErrors(errors, 'endTime')}</Typography>
              )}
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
}

export default DialogAdd
