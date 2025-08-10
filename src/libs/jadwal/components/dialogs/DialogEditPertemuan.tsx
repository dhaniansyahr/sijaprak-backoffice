import { Autocomplete, Box, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import FormDatePicker from 'src/components/shared/input/date'
import { getJadwal, updateMeeting } from 'src/stores/jadwal/action'
import { setIsRefresh } from 'src/stores/jadwal/slice'
import { useAppDispatch } from 'src/utils/dispatch'

interface IDialogProps {
  dialogRef: React.RefObject<IDialogRef>
  id: string
}

const DialogEditPertemuan = ({ dialogRef, id }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, handleSubmit, setError } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const [meetings, setMeetings] = useState<any>(null)
  const [isFetchMeeting, setIsFetchMeeting] = useState(false)
  const [meetingId, setMeetingId] = useState<any>(null)

  const handleGetMeeting = async () => {
    setIsFetchMeeting(true)

    // @ts-ignore
    await dispatch(getJadwal({ id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsFetchMeeting(false)

        return
      }

      setMeetings(res.payload.content?.Meeting)
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
    if (id) {
      handleGetMeeting()
    }
  }, [id])

  return (
    <Dialog ref={dialogRef} title='Edit Pertemuan' onSubmit={onSubmit} isLoading={isLoading}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormDatePicker
            name='tanggal'
            control={control}
            rules={{ required: 'Tanggal Pertemuan tidak boleh kosong' }}
            label='Tanggal Pertemuan Baru'
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
                  <TextField
                    {...params}
                    label='Pertemuan'
                    placeholder='Pilih Pertemuan'
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
            rules={{ required: 'Pertemuan tidak boleh kosong' }}
          />
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default DialogEditPertemuan
