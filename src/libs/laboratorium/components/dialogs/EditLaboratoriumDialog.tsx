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

const EditLaboratoriumDialog = ({ open, onClose, values }: any) => {
  const { watch, setValue, reset } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
  }

  useEffect(() => {
    setValue('namaRuangan', values?.nama)
    setValue('namaKepala', values?.namaKepala)
    setValue('nipKepala', values?.nip)
    setValue('lokasi', values?.lokasi)
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
          <Typography variant='h5'>Edit Ruangan Laboratorium</Typography>
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
              label='Nama Ruangan'
              placeholder='Masukan Nama Ruangan'
              value={watch('namaRuangan') ?? ''}
              onChange={(e: any) => {
                setValue('namaRuangan', e.target.value)
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label='Nama Kepala Lab'
              placeholder='Masukan Nama Kepala Lab'
              value={watch('namaKepala') ?? ''}
              onChange={(e: any) => {
                setValue('namaKepala', e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label='NIP Kepala Lab'
              placeholder='Masukan NIP Kepala Lab'
              value={watch('nipKepala') ?? ''}
              onChange={(e: any) => {
                setValue('nipKepala', e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label='Lokasi Ruangan'
              placeholder='Masukan Lokasi Ruangan'
              value={watch('lokasi') ?? ''}
              onChange={(e: any) => {
                setValue('lokasi', e.target.value)
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

export default EditLaboratoriumDialog
