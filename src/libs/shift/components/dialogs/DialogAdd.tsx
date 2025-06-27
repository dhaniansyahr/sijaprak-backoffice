// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'
import { TCreateShift } from 'src/stores/shift/types'
import moment from 'moment'
import { useAppDispatch } from 'src/utils/dispatch'
import { setIsRefresh } from 'src/stores/shift/slice'
import toast from 'react-hot-toast'
import { handleMapErrors, IDialogProps } from 'src/utils/response.utils'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import ActionDialog from 'src/components/shared/dialog/dialog-action'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import FormDatePicker from 'src/components/shared/input/date'
import { Typography } from '@mui/material'
import { createShift } from 'src/stores/shift/action'

const Transition = TransitionDialog

const DialogAdd = ({ open, onClose }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, reset, handleSubmit } = useForm<TCreateShift>({
    defaultValues: {
      startTime: null,
      endTime: null
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>([])

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose()

    // @ts-ignore
    dispatch(setIsRefresh())
  }

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
        onClose={handleClose}
        title='Tambah Shift'
        description='Isi formulir berikut untuk detail shift baru'
      />

      <form onSubmit={onSubmit}>
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: '5px' }}
        >
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
          </Grid>
        </DialogContent>

        <ActionDialog isLoading={isLoading} onClose={handleClose} />
      </form>
    </Dialog>
  )
}

export default DialogAdd
