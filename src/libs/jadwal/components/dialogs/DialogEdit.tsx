import { Autocomplete, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { useAppDispatch } from 'src/utils/dispatch'
import { hariOptions } from './DialogAdd'
import { getAllShift } from 'src/stores/master-data/shift/action'
import { IUpdateJadwal } from '.'
import toast from 'react-hot-toast'
import { getJadwal } from 'src/stores/jadwal/action'

interface IDialogProps {
  dialogRef: React.RefObject<IDialogRef>
  id: string
  onSubmit: () => void
  isLoading: boolean
}

const DialogEdit = ({ dialogRef, id, onSubmit, isLoading }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, setValue, reset } = useFormContext<IUpdateJadwal>()

  const [shifts, setShifts] = useState<any>(null)
  const [isLoadShift, setIsLoadShift] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

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
        toast.error(res?.payload?.response?.data?.message)
        setIsLoadShift(false)

        return
      }

      setShifts(res.payload.content?.entries)
      setIsLoadShift(false)
    })
  }

  const handleGetJadwalData = async () => {
    if (!id) return

    setIsLoadingData(true)

    // @ts-ignore
    await dispatch(getJadwal({ id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.message)
        setIsLoadingData(false)

        return
      }

      const jadwalData = res.payload.content

      // Populate form dengan data yang akan diedit
      setValue('hari', jadwalData.hari)
      setValue('shiftId', jadwalData.shiftId)
      setValue('isOverride', false)

      setIsLoadingData(false)
    })
  }

  useEffect(() => {
    if (id && dialogRef.current?.isOpen) {
      handleGetShift()
      handleGetJadwalData()
    }
  }, [id, dialogRef.current?.isOpen])

  // Reset form ketika dialog ditutup
  useEffect(() => {
    if (!dialogRef.current?.isOpen) {
      reset({
        hari: '',
        shiftId: '',
        isOverride: false
      })
    }
  }, [dialogRef.current?.isOpen, reset])

  return (
    <Dialog ref={dialogRef} title='Edit Jadwal' onSubmit={onSubmit} isLoading={isLoading || isLoadingData}>
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
                loading={isLoadingData}
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
                loading={isLoadShift || isLoadingData}
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
