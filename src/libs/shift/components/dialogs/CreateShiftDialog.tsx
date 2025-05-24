import { Icon } from '@iconify/react'
import { CircularProgress, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

import { TCreateShift } from 'src/stores/shift/types'
import moment from 'moment'
import { useCreateShift } from 'src/stores/shift/service'
import { useAppDispatch } from 'src/utils/dispatch'
import { setIsRefresh } from 'src/stores/shift/slice'
import { LoadingButton } from '@mui/lab'
import { DatePickerInputs } from 'src/components/templates/custom/DatePickerInput'
import toast from 'react-hot-toast'
import { IDialogProps } from 'src/utils/response.utils'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const CreateShiftDialog = ({ open, onClose }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, reset, handleSubmit } = useForm<TCreateShift>({
    defaultValues: {
      startTime: null,
      endTime: null
    }
  })

  const { mutate, isCreating } = useCreateShift()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose()

    // @ts-ignore
    dispatch(setIsRefresh())
  }

  const onSubmit = handleSubmit(async value => {
    try {
      const body = {
        startTime: moment(value.startTime).format('HH:mm'),
        endTime: moment(value.endTime).format('HH:mm')
      }

      const res = await mutate(body)

      toast.success(res?.message)

      handleClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.errors?.[0]?.message || error?.response?.data?.message)
    }
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
      <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: 'primary.dark' }}>
        <IconButton
          onClick={() => {
            handleClose()
          }}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='material-symbols:close' color='white' />
        </IconButton>
        <Box>
          <Typography variant='h5' color={'white'}>
            Tambah Shift
          </Typography>
          <Typography color={'white'}>Isi formulir berikut untuk detail shift baru</Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: '5px' }}
        >
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Controller
                name='startTime'
                control={control}
                render={({ field, fieldState }) => {
                  const value = field.value ? moment(field.value).toDate() : null

                  return (
                    <DatePickerWrapper>
                      <DatePicker
                        selected={value}
                        onChange={date => field.onChange(date)} // Use field.onChange
                        autoComplete='off'
                        showTimeSelect
                        showTimeSelectOnly
                        isClearable
                        dateFormat='HH:mm'
                        customInput={<DatePickerInputs fullWidth label='Start Time' placeholder='HH:mm' />}
                        popperContainer={({ children }) => (
                          <Box sx={{ position: 'fixed', zIndex: 99999 }}>{children}</Box>
                        )}
                      />
                      {fieldState.error && <span className='error-message'>{fieldState.error.message}</span>}
                    </DatePickerWrapper>
                  )
                }}
                rules={{
                  required: 'Start time is required' // Add validation rules if needed
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name='endTime'
                control={control}
                render={({ field, fieldState }) => {
                  const value = field.value ? moment(field.value).toDate() : null

                  return (
                    <DatePickerWrapper>
                      <DatePicker
                        selected={value}
                        onChange={date => field.onChange(date)} // Use field.onChange
                        autoComplete='off'
                        isClearable
                        dateFormat='HH:mm'
                        showTimeSelect
                        showTimeSelectOnly
                        customInput={<DatePickerInputs fullWidth label='End Time' placeholder='HH:mm' />}
                        popperContainer={({ children }) => (
                          <Box sx={{ position: 'fixed', zIndex: 99999 }}>{children}</Box>
                        )}
                      />
                      {fieldState.error && <span className='error-message'>{fieldState.error.message}</span>}
                    </DatePickerWrapper>
                  )
                }}
                rules={{
                  required: 'Mohon mengisikan waktu berakhir!' // Add validation rules if needed
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'end', px: { xs: 8, sm: 15 } }}>
          <Box display='flex' gap={4}>
            <Button
              variant='contained'
              color='secondary'
              size='medium'
              disabled={isLoading}
              onClick={() => handleClose()}
            >
              Batal
            </Button>
            <LoadingButton
              loading={isCreating}
              loadingIndicator={<CircularProgress size={20} />}
              type='submit'
              variant='contained'
              disabled={isLoading}
            >
              Simpan
            </LoadingButton>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateShiftDialog
