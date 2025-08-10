import { LoadingButton } from '@mui/lab'
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { bulkUploadJadwal, generateJawdal } from 'src/stores/jadwal/action'
import { setIsRefresh } from 'src/stores/jadwal/slice'
import { useAppDispatch } from 'src/utils/dispatch'

interface IDialogUploadProps {
  dialogRef: React.RefObject<IDialogRef>
}

export default function DialogUpload({ dialogRef }: IDialogUploadProps) {
  const dispatch = useAppDispatch()

  const form = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const onGenerate = async () => {
    // @ts-ignore
    await dispatch(generateJawdal())
      .then(res => {
        if (res.meta.requestStatus !== 'fulfilled') {
          toast.error(res.payload?.response?.data?.message)

          return
        }

        toast.success(res.payload.message)
        dialogRef.current?.close()
        dispatch(setIsRefresh())
      })
      .finally(() => setIsLoading(false))
  }

  const onSubmit = form.handleSubmit(async (value: any) => {
    setIsLoading(true)

    const body: any = {
      file: value?.file
    }

    // @ts-ignore
    await dispatch(bulkUploadJadwal({ data: body })).then(async res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.message)

        return
      }

      await onGenerate()
    })
  })

  return (
    <Dialog
      ref={dialogRef}
      title='Bulk Upload Teori'
      onSubmit={onSubmit}
      customAction={
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' color='secondary' type='button' disabled={isLoading}>
              Batal
            </Button>
            <LoadingButton
              variant='contained'
              color='primary'
              type='submit'
              disabled={isLoading}
              loading={isLoading}
              loadingIndicator={<CircularProgress size={16} />}
            >
              Prosess & Generate
            </LoadingButton>
          </Box>
        </Grid>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name='file'
            control={form.control}
            render={({ field }) => (
              <TextField
                fullWidth
                label='File'
                value={field.value ? field.value.name : 'Pilih file'}
                inputProps={{
                  readOnly: true
                }}
                InputProps={{
                  endAdornment: (
                    <>
                      <Button
                        sx={{ whiteSpace: 'nowrap' }}
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                          document.getElementById('file')?.click()
                        }}
                      >
                        Pilih File
                      </Button>
                      <input
                        type='file'
                        id='file'
                        accept='.xlsx .xls'
                        hidden
                        onChange={async e => {
                          const file = e.target.files?.[0]

                          if (file) {
                            field.onChange(file)
                          }
                        }}
                      />
                    </>
                  )
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Dialog>
  )
}
