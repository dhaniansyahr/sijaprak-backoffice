import { Autocomplete, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { useAppDispatch } from 'src/utils/dispatch'
import toast from 'react-hot-toast'
import { getMatakuliah, updateMatakuliah } from 'src/stores/master-data/mata-kuliah/action'
import { setIsRefresh } from 'src/stores/master-data/mata-kuliah/slice'

interface IDialogProps {
  dialogRef: React.RefObject<IDialogRef>
  id: string
  isLoading: boolean
}

const TIPE = [
  {
    label: 'Wajib',
    value: 'WAJIB'
  },
  {
    label: 'Pilihan',
    value: 'PILIHAN'
  }
]

const BIDANG_MINAT = [
  {
    label: 'Rekayasa Perangkat Lunak',
    value: 'RPL'
  },
  {
    label: 'Data Mining',
    value: 'DATA_MINING'
  },
  {
    label: 'Jaringan',
    value: 'JARINGAN'
  },
  {
    label: 'GIS',
    value: 'GIS'
  },
  {
    label: 'Umum',
    value: 'UMUM'
  }
]

const SEMESTER = Array.from({ length: 8 }, (_, index) => index + 1)

const DialogEdit = ({ dialogRef, id, isLoading }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control, setValue, handleSubmit } = useForm()

  const [isLoadingData, setIsLoadingData] = useState(false)

  const handleGetDetail = async () => {
    setIsLoadingData(true)

    // @ts-ignore
    await dispatch(getMatakuliah({ id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.message)
        setIsLoadingData(false)

        return
      }

      const content = res.payload.content

      setValue('nama', content.nama)
      setValue('kode', content.kode)
      setValue('sks', content.sks)
      setValue('semester', content.semester)
      setValue('bidangMinat', content.bidangMinat)
      setValue('isTeori', content.isTeori)
      setValue('type', content.type)
      setIsLoadingData(false)
    })
  }

  useEffect(() => {
    if (id && dialogRef.current?.isOpen) {
      handleGetDetail()
    }
  }, [id, dialogRef.current?.isOpen])

  const onSubmit = handleSubmit(async data => {
    setIsLoadingData(true)

    const body = {
      nama: data.nama,
      kode: data.kode,
      sks: data.sks,
      semester: data.semester,
      bidangMinat: data.bidangMinat,
      isTeori: data.isTeori,
      type: data.type
    }

    // @ts-ignore
    await dispatch(updateMatakuliah({ data: body, id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        const errors = res.payload.response.data?.errors || []

        if (errors.length > 0) {
          errors.forEach((error: any) => {
            toast.error(error.message)
          })
        }

        toast.error(res?.payload?.response?.data?.message)

        setIsLoadingData(false)

        return
      }

      toast.success(res.payload.message)
      dialogRef.current?.close()
      dispatch(setIsRefresh())
      setIsLoadingData(false)
    })
  })

  return (
    <Dialog ref={dialogRef} title='Edit Jadwal' onSubmit={onSubmit} isLoading={isLoading || isLoadingData}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='nama'
            render={({ field }) => (
              <TextField {...field} fullWidth label='Nama Matakuliah' placeholder='Masukan Nama Matakuliah' />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='kode'
            render={({ field }) => (
              <TextField {...field} label='Kode Matakuliah' placeholder='Masukan Kode Matakuliah' fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <Autocomplete
                options={TIPE}
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <TextField {...params} label='Tipe Matakuliah' placeholder='Pilih Tipe Matakuliah' />
                )}
                value={TIPE.find((item: any) => item?.value === field?.value) || null}
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
            name='sks'
            render={({ field }) => (
              <TextField
                {...field}
                label='SKS'
                fullWidth
                placeholder='Masukan SKS'
                type='number'
                inputProps={{ min: 0 }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='bidangMinat'
            render={({ field }) => (
              <Autocomplete
                loading={isLoadingData}
                options={BIDANG_MINAT || []}
                getOptionLabel={(option: any) => `${option?.label}`}
                renderInput={params => <TextField {...params} label='Bidang Minat' placeholder='Pilih Bidang Minat' />}
                value={BIDANG_MINAT?.find((item: any) => item?.value === field?.value) || null}
                onChange={(_, value) => {
                  field.onChange(value?.value || null)
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='isTeori'
            render={({ field }) => (
              <RadioGroup row value={field.value} onChange={field.onChange}>
                <FormControlLabel value='true' control={<Radio />} label='Teori' />
                <FormControlLabel value='false' control={<Radio />} label='Praktikum' />
              </RadioGroup>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='semester'
            render={({ field }) => (
              <Autocomplete
                loading={isLoadingData}
                options={SEMESTER || []}
                getOptionLabel={(option: any) => `${option}`}
                renderInput={params => <TextField {...params} label='Semester' placeholder='Pilih Semester' />}
                value={SEMESTER?.find((item: any) => item === field?.value) || null}
                onChange={(_, value) => {
                  field.onChange(value || null)
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
