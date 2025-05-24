// React Imports
import React, { ReactElement, Ref, forwardRef, useState } from 'react'

// MUI Imports
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

// Third Party Imports
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'

// Component
import { LoadingButton } from '@mui/lab'

import { CustomTextField } from 'src/components/templates/custom/CustomTextField'

// Redux & Types
import { setIsRefresh } from 'src/stores/laboratorium/slice'
import { TAssignKepalaLab, TRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useAppDispatch } from 'src/utils/dispatch'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface IDialogAssignKepalaLab {
  open: boolean
  onClose: (v: boolean) => void
  values: TRuanganLaboratorium
}

const DialogAssignKepalaLab = ({ open, onClose, values }: IDialogAssignKepalaLab) => {
  const dispatch = useAppDispatch()

  const { control, reset, handleSubmit } = useForm<TAssignKepalaLab>({
    values: {
      nama: values?.namaKepalaLab || '',
      nip: values?.nipKepalaLab || ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setIsLoading(false)
    reset()
    onClose(false)

    // @ts-ignore
    dispatch(setIsRefresh())
  }

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(assignKepalaLab({ data: value, id: values?.id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)
        toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message)

        return
      }

      setIsLoading(true)
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
            Pergantian Kepala Laboratorium
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent
          sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
          style={{ paddingTop: '5px' }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CustomTextField
                name='nama'
                label='Nama Kepala Lab'
                placeholder='Masukan Nama Kepala Ruangan Laboratorium'
                control={control}
                rules={{ required: 'Nama Kepala Lab is Required!' }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                name='nip'
                label='NIP Kepala'
                placeholder='Masukan NIP Kepala Ruangan Laboratorium (Ex. Gedung A Lantai 3)'
                control={control}
                fullWidth
                rules={{ required: 'NIP Kepala Ruangan is Required!' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'end', px: { xs: 8, sm: 15 } }}>
          <Button variant='contained' color='secondary' disabled={isLoading} onClick={() => handleClose()}>
            Batal
          </Button>
          <LoadingButton
            loadingIndicator={<CircularProgress size={20} />}
            type='submit'
            loading={isLoading}
            variant='contained'
            disabled={isLoading}
          >
            Simpan
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogAssignKepalaLab
