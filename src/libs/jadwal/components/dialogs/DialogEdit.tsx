import { Autocomplete, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { updateJadwal, updateMeeting } from 'src/stores/jadwal/action'
import { setIsRefresh } from 'src/stores/jadwal/slice'
import { useAppDispatch } from 'src/utils/dispatch'
import { hariOptions } from './DialogAdd'
import { getAllShift } from 'src/stores/master-data/shift/action'

interface IDialogProps {
  dialogRef: React.RefObject<IDialogRef>
  id: string
}

const DialogEdit = ({ dialogRef, id }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, handleSubmit, setError } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const [shifts, setShifts] = useState<any>(null)
  const [isLoadShift, setIsLoadShift] = useState(false)

  const handleGetShift = async () => {
    setIsLoadShift(true)

    const body: any = {
      params: {
        page: 1,
        rows: 1000
      }
    }

    // @ts-ignore
    await dispatch(getAllShift({ data: body })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoadShift(false)

        return
      }

      setShifts(res.payload.content?.entries)
      setIsLoadShift(false)
    })
  }

  const onSubmit = handleSubmit(async data => {
    setIsLoading(true)

    const body = Object.assign({}, data)

    // @ts-ignore
    await dispatch(updateJadwal({ data: body, id })).then(res => {
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
      handleGetShift()
    }
  }, [id])

  return (
    <Dialog ref={dialogRef} title='Edit Jadwal' onSubmit={onSubmit} isLoading={isLoading}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='hari'
            render={({ field }) => (
              <Autocomplete
                options={hariOptions}
                getOptionLabel={option => option}
                renderInput={params => <TextField {...params} label='Hari' placeholder='Pilih Hari' />}
                value={hariOptions.find((item: any) => item === field?.value) || null}
                onChange={(_, value) => {
                  field.onChange(value)
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='shiftId'
            render={({ field }) => (
              <Autocomplete
                loading={isLoadShift}
                options={shifts || []}
                getOptionLabel={(option: any) => `${option?.startTime} - ${option?.endTime}`}
                renderInput={params => <TextField {...params} label='Shift' placeholder='Pilih Shift' />}
                value={shifts?.find((item: any) => item?.id === field?.value) || null}
                onChange={(_, value) => {
                  field.onChange(value?.id || null)
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default DialogEdit
