import { LoadingButton } from '@mui/lab'
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Dialog, { DialogRef } from 'src/components/shared/dialog'
import { useAuth } from 'src/hooks/useAuth'
import { pendaftaranAsistenLab } from 'src/stores/asisten-lab/action'
import { useAppDispatch } from 'src/utils/dispatch'

interface IDialogPendaftaranProps {
  dialogRef: React.RefObject<DialogRef>
  jadwalId: string
}

const DialogPendaftaran = ({ dialogRef, jadwalId }: IDialogPendaftaranProps) => {
  const dispatch = useAppDispatch()

  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, setError } = useForm()

  const onSubmit = handleSubmit(async (data: any) => {
    setIsLoading(true)

    const body = {
      jadwalId,
      mahasiswaId: user?.id,
      nilaiTeori: data.nilaiTeori,
      nilaiPraktikum: data.nilaiPraktikum,
      nilaiAkhir: data.nilaiAkhir
    }

    // @ts-ignore
    await dispatch(pendaftaranAsistenLab({ data: body })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        const errors = res?.payload?.response?.data?.errors

        errors?.forEach((error: any) => {
          setError(error.field, { message: error.message })
        })

        toast.error(errors?.[0]?.message || res?.payload?.response?.data?.message)

        return
      }

      setIsLoading(false)

      toast.success(res?.payload?.message)

      dialogRef.current?.close()
    })
  })

  return (
    <Dialog
      ref={dialogRef}
      isOpen={dialogRef.current?.isOpen ?? false}
      onChange={open => {
        if (!open) {
          dialogRef.current?.close()
        }
      }}
      title='Pendaftaran Asisten Laboratorium'
      maxWidth='sm'
      fullWidth
    >
      {() => (
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='nilaiTeori'
                render={({ field }) => <TextField {...field} label='Nilai Teori' fullWidth />}
                rules={{ required: 'Nilai Teori harus diisi' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='nilaiPraktikum'
                render={({ field }) => <TextField {...field} label='Nilai Praktikum' fullWidth />}
                rules={{ required: 'Nilai Praktikum harus diisi' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='nilaiAkhir'
                render={({ field }) => <TextField {...field} label='Nilai Akhir' fullWidth />}
                rules={{ required: 'Nilai Akhir harus diisi' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant='outlined' color='primary' onClick={() => dialogRef.current?.close()}>
                  Batal
                </Button>
                <LoadingButton
                  variant='contained'
                  color='primary'
                  type='submit'
                  loading={isLoading}
                  loadingIndicator={<CircularProgress />}
                >
                  Daftar
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Dialog>
  )
}

export default DialogPendaftaran
