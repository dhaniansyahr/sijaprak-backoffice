import { LoadingButton } from '@mui/lab'
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Dialog, { DialogRef } from 'src/components/shared/dialog'
import FormDatePicker from 'src/components/shared/input/date'
import { getAllMeetings, updateMeeting } from 'src/stores/jadwal/action'
import { setIsRefresh } from 'src/stores/jadwal/slice'
import { useAppDispatch } from 'src/utils/dispatch'

interface IDialogProps {
  dialogRef: React.RefObject<DialogRef>
  row: any
}

const DialogEdit = ({ dialogRef, row }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, handleSubmit, setError } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const [meetings, setMeetings] = useState<any>(null)
  const [isFetchMeeting, setIsFetchMeeting] = useState(false)
  const [meetingId, setMeetingId] = useState<any>(null)

  const handleGetMeeting = async () => {
    setIsFetchMeeting(true)

    // @ts-ignore
    await dispatch(getAllMeetings({ jadwalId: row?.id, data: { params: { page: 1, rows: 10000 } } })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsFetchMeeting(false)

        return
      }

      setMeetings(res.payload.content?.entries)
      setIsFetchMeeting(false)
    })
  }

  const onSubmit = handleSubmit(async data => {
    setIsLoading(true)

    const body = {
      tanggal: moment(data?.tanggal).format('YYYY-MM-DD'),
      pertemuan: data?.pertemuan
    }

    // @ts-ignore
    await dispatch(updateMeeting({ data: body, id: meetingId })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        const errors = res.payload.response.data?.errors || []

        errors.forEach((error: any) => {
          setError(error.field, { message: error.message })
        })

        toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message)

        return
      }

      setIsLoading(false)
      toast.success(res.payload.message)
      dialogRef.current?.close()
      dispatch(setIsRefresh())
    })
  })

  useEffect(() => {
    if (row?.id) {
      handleGetMeeting()
    }
  }, [row?.id])

  return (
    <Dialog
      ref={dialogRef}
      isOpen={dialogRef.current?.isOpen ?? false}
      onChange={open => {
        if (!open) {
          dialogRef.current?.close()
        }
      }}
      title='Edit Pertemuan'
      maxWidth='md'
      fullWidth
    >
      {close => (
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormDatePicker
                name='tanggal'
                control={control}
                rules={{ required: 'Tanggal Pertemuan tidak boleh kosong' }}
                label='Tanggal Pertemuan'
                placeholder='yyyy-mm-dd'
                dateFormat='yyyy-MM-dd'
                popperContainer={({ children }) => <Box sx={{ position: 'fixed', zIndex: 99999 }}>{children}</Box>}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='pertemuan'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    loading={isFetchMeeting}
                    options={meetings ?? []}
                    getOptionLabel={(option: any) =>
                      `Pertemuan ${option?.pertemuan}${option?.tanggal ? ` - ${option?.tanggal}` : ''}`
                    }
                    onChange={(_, value) => {
                      field.onChange(value?.pertemuan)
                      setMeetingId(value?.id)
                    }}
                    renderInput={params => (
                      <TextField {...params} label='Pertemuan' error={!!error} helperText={error?.message} />
                    )}
                  />
                )}
                rules={{ required: 'Pertemuan tidak boleh kosong' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display='flex' justifyContent={'flex-end'} gap={4}>
                <Button variant='contained' color='secondary' size='medium' disabled={isLoading} onClick={close}>
                  Batal
                </Button>

                <LoadingButton
                  variant='contained'
                  color='primary'
                  type='submit'
                  loading={isLoading}
                  loadingIndicator={<CircularProgress size={20} />}
                >
                  Submit
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Dialog>
  )
}

export default DialogEdit
