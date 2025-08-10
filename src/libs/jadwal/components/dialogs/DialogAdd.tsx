import { Autocomplete, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { getAllMatakuliah } from 'src/stores/master-data/mata-kuliah/action'
import { getAllRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'
import { getAllShift } from 'src/stores/master-data/shift/action'
import { useAppDispatch } from 'src/utils/dispatch'
import { ICreateJadwal } from '.'

interface IDialogProps {
  dialogRef: React.RefObject<IDialogRef>
  onSubmit: () => void
}

export const hariOptions = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU']
const kelasOptions = ['A', 'B', 'C', 'D']

const DialogAdd = ({ dialogRef, onSubmit }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { control } = useFormContext<ICreateJadwal>()

  const [shifts, setShifts] = useState<any>(null)
  const [ruangans, setRuangans] = useState<any>(null)
  const [matakuliahs, setMatakuliahs] = useState<any>(null)
  const [isLoadDropdown, setIsLoadDropdown] = useState(false)

  const handleGetAllDropdown = async () => {
    setIsLoadDropdown(true)

    const body: any = {
      params: {
        page: 1,
        rows: 1000
      }
    }

    const bodyMk: any = {
      params: {
        page: 1,
        rows: 1000,
        filters: { isTeori: false }
      }
    }

    bodyMk.params.filters = JSON.stringify(bodyMk.params.filters)

    const promiseArr = [
      dispatch(getAllMatakuliah({ data: bodyMk })),
      dispatch(getAllShift({ data: body })),
      dispatch(getAllRuanganLaboratorium({ data: body }))
    ]

    const promises = await Promise.all(promiseArr)

    const hasError = promises?.find(item => item.meta.requestStatus !== 'fulfilled')

    if (hasError) {
      toast.error(hasError?.payload?.response?.data?.message)
      setIsLoadDropdown(false)

      return
    }

    const [mk, shift, ruangan] = promises

    setMatakuliahs(mk?.payload?.content?.entries)
    setShifts(shift?.payload?.content?.entries)
    setRuangans(ruangan?.payload?.content?.entries)
    setIsLoadDropdown(false)
  }

  useEffect(() => {
    handleGetAllDropdown()
  }, [dialogRef.current?.isOpen])

  return (
    <Dialog ref={dialogRef} title='Tambah Jadwal Praktikum' onSubmit={onSubmit}>
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
                loading={isLoadDropdown}
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

        <Grid item xs={12}>
          <Controller
            control={control}
            name='matakuliahId'
            render={({ field }) => (
              <Autocomplete
                loading={isLoadDropdown}
                options={matakuliahs || []}
                getOptionLabel={(option: any) => `${option?.nama}`}
                renderInput={params => <TextField {...params} label='Mata Kuliah' placeholder='Pilih Mata Kuliah' />}
                value={matakuliahs?.find((item: any) => item?.id === field?.value) || null}
                onChange={(_, value) => {
                  field.onChange(value?.id || null)
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='ruanganId'
            render={({ field }) => (
              <Autocomplete
                loading={isLoadDropdown}
                options={ruangans || []}
                getOptionLabel={(option: any) => option?.nama}
                renderInput={params => <TextField {...params} label='Ruangan' placeholder='Pilih Ruangan' />}
                value={ruangans?.find((item: any) => item?.id === field?.value) || null}
                onChange={(_, value) => {
                  field.onChange(value?.id || null)
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='kelas'
            render={({ field }) => (
              <Autocomplete
                options={kelasOptions}
                getOptionLabel={option => option}
                renderInput={params => <TextField {...params} label='Kelas' placeholder='Pilih Kelas' />}
                value={kelasOptions.find((item: any) => item === field?.value) || null}
                onChange={(_, value) => {
                  field.onChange(value)
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default DialogAdd
