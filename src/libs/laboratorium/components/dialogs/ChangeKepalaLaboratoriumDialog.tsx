import { Icon } from '@iconify/react'
import { DialogTitle, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { ReactElement, Ref, forwardRef, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const ChangeKepalaLaboratoriumDialog = ({ open, onClose, values }: any) => {
  const { watch, setValue, reset } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
  }

  useEffect(() => {
    setValue('namaKepala', values?.namaKepala)
    setValue('nipKepala', values?.nip)
  }, [open])

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
          <Typography variant='h5'>Pergantian Kepala Laboratorium</Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
        style={{ paddingTop: '5px' }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField fullWidth required label='Nama Kepala Lab Lama' value={watch('namaKepala') ?? ''} disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth required label='NIP Kepala Lab Lama' disabled value={watch('nipKepala') ?? ''} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label='Nama Kepala Lab Baru'
              placeholder='Masukan Nama Kepala Lab Baru'
              value={watch('namaKepalaBaru') ?? ''}
              onChange={(e: any) => {
                setValue('namaKepalaBaru', e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label='nip Kepala Lab Baru'
              placeholder='Masukan nip Kepala Lab Baru'
              value={watch('nipKepalaBaru') ?? ''}
              onChange={(e: any) => {
                setValue('nipKepalaBaru', e.target.value)
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'end', px: { xs: 8, sm: 15 } }}>
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
      </DialogActions>
    </Dialog>
  )
}

export default ChangeKepalaLaboratoriumDialog
