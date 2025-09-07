import { Icon } from '@iconify/react'
import { LoadingButton } from '@mui/lab'
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
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

  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)

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

  const onSubmit = async () => {
    setIsLoading(true)

    const body: any = {
      file: selectedFile
    }

    // @ts-ignore
    await dispatch(bulkUploadJadwal({ data: body })).then(async res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.message)

        setIsLoading(false)

        return
      }

      setIsLoading(false)

      await onGenerate()
    })
  }

  return (
    <Dialog
      ref={dialogRef}
      title='Bulk Upload Teori'
      onSubmit={onSubmit}
      customAction={
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' color='secondary' type='button' disabled={isLoading || selectedFile === null}>
              Batal
            </Button>
            <LoadingButton
              variant='contained'
              color='primary'
              type='submit'
              disabled={isLoading || selectedFile === null}
              loading={isLoading}
              loadingIndicator={<CircularProgress size={16} />}
            >
              Prosess & Generate
            </LoadingButton>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => {
                document.getElementById('file')?.click()
              }}
              startIcon={<Icon icon='mdi:file-outline' />}
              disabled={selectedFile}
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
                  setSelectedFile(file)
                }
              }}
            />
          </Box>
        </Grid>
      }
    >
      <Grid container spacing={2}>
        {selectedFile ? (
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: theme => theme.palette.primary.main + '22',
                color: theme => theme.palette.primary.main,
                p: 2,
                borderRadius: 1,
                justifyContent: 'space-between'
              }}
            >
              <Typography variant='body1' color={'primary'}>
                {selectedFile?.name}
              </Typography>
              <IconButton onClick={() => setSelectedFile(null)}>
                <Icon icon='mdi:delete' />
              </IconButton>
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography variant='h6' color={'primary'} align='center'>
              Pilih file untuk diupload
            </Typography>
          </Grid>
        )}
      </Grid>
    </Dialog>
  )
}
