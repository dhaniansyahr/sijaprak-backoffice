import { CircularProgress, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { penerimaanAsistenLab } from 'src/stores/asisten-lab/action'
import { useAppDispatch } from 'src/utils/dispatch'
import { setIsRefresh } from 'src/stores/asisten-lab/slice'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { LoadingButton } from '@mui/lab'

interface Props {
  dialogRef: React.RefObject<IDialogRef>

  id: string
}

const DialogRejection = ({ dialogRef, id }: Props) => {
  const dispatch = useAppDispatch()
  const { control, handleSubmit } = useForm()

  const [isLoading, setIsLoading] = useState<any>(false)

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)
    toast.loading('Loading...')

    const body = {
      status: 'DITOLAK',
      keterangan: value?.reason
    }

    // @ts-ignore
    await dispatch(penerimaanAsistenLab({ data: body, id })).then(res => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        const errors = res?.payload?.response?.data

        toast.dismiss()
        toast.error(errors?.errors?.[0]?.message || errors?.message)
        setIsLoading(false)

        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)

      dispatch(setIsRefresh())
      setIsLoading(false)
    })
  })

  return (
    <Dialog
      ref={dialogRef}
      title='Penolakan Pendaftaran Asisten Laboratorium'
      customAction={
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' color='primary' onClick={() => dialogRef.current?.close()}>
              Batal
            </Button>
            <LoadingButton
              variant='contained'
              color='error'
              type='submit'
              loading={isLoading}
              loadingIndicator={<CircularProgress size={20} />}
            >
              Tolak
            </LoadingButton>
          </Box>
        </Grid>
      }
      onSubmit={onSubmit}
      isLoading={isLoading}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='reason'
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                placeholder='Masukan alasan Penolakan'
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default DialogRejection
