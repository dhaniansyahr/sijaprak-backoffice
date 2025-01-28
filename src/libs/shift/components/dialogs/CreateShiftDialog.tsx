import { Icon } from '@iconify/react'
import { DialogTitle, FormControlLabel, Switch, TextField } from '@mui/material'
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
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import DatePickerInputs from 'src/components/templates/custom-inputs/DatePickerInput'
import 'react-datepicker/dist/react-datepicker.css'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const CreateShiftDialog = ({ open, onClose }: any) => {
  const { watch, setValue, reset } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' TransitionComponent={Transition}>
      <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: '#F7F7F9' }}>
        <IconButton
          onClick={() => {
            handleClose()
          }}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='material-symbols:close' />
        </IconButton>
        <Box>
          <Typography variant='h5'>Tambah Shift</Typography>
          <Typography>Isi formulir berikut untuk detail shift baru</Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
        style={{ paddingTop: '5px' }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label='Nama Shift'
              placeholder='Masukan Nama Shfit'
              value={watch('nama') ?? ''}
              onChange={(e: any) => {
                setValue('nama', e.target.value)
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={watch('startTime') ?? null}
                onChange={(date: any) => {
                  setValue('startTime', date)
                }}
                autoComplete='off'
                showTimeSelect
                showTimeSelectOnly
                isClearable
                dateFormat={'HH:mm'}
                customInput={<DatePickerInputs label='Start Time' placeholderText='HH:mm' />}
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={watch('endTime') ?? null}
                onChange={(date: any) => {
                  setValue('endTime', date)
                }}
                autoComplete='off'
                showTimeSelect
                showTimeSelectOnly
                isClearable
                dateFormat={'HH:mm'}
                customInput={<DatePickerInputs label='End Time' placeholderText='HH:mm' />}
              />
            </DatePickerWrapper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'space-between', px: { xs: 8, sm: 15 } }}>
        <Box>
          <FormControlLabel
            control={
              <Switch value={watch('isActive')} onChange={e => setValue('isActive', e.target.value)} color='success' />
            }
            label='Is Active'
          />
        </Box>
        <Box display='flex' gap={4}>
          <Button
            variant='contained'
            color='secondary'
            size='medium'
            disabled={isLoading}
            sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
            onClick={() => handleClose()}
          >
            Batal
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={isLoading}
            sx={{ padding: { sm: '5px 20px', xs: '5px 15px' } }}
          >
            Simpan
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default CreateShiftDialog
