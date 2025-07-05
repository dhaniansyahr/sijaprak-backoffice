import { Autocomplete, Grid, TextField } from '@mui/material'
import { hariOptions } from '../../containers/CreateJadwal'
import { Control, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'src/utils/dispatch'
import { getAllShift } from 'src/stores/shift/action'
import { getAllRuanganLaboratorium } from 'src/stores/laboratorium/action'
import { getAllMataKuliah } from 'src/stores/jadwal/action'

interface IFormJadwalProps {
  control: Control<any>
}

export default function FormJadwal(props: IFormJadwalProps) {
  const dispatch = useAppDispatch()

  const { control } = props

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>({
    shifts: null,
    mataKuliah: null,
    ruangan: null
  })

  const handleGetData = async () => {
    setIsLoading(true)

    const body: any = {
      params: {
        page: 1,
        rows: 1000000
      }
    }

    // @ts-ignore
    const [mataKuliah, shift, ruangan] = await Promise.all([
      dispatch(getAllMataKuliah({ data: body })),
      dispatch(getAllShift({ data: body })),
      dispatch(getAllRuanganLaboratorium({ data: body }))

      // dispatch(getAllDosen({ data: body }))
    ])

    if (
      mataKuliah?.meta?.requestStatus !== 'fulfilled' ||
      shift?.meta?.requestStatus !== 'fulfilled' ||
      ruangan?.meta?.requestStatus !== 'fulfilled'
    ) {
      setIsLoading(false)

      return
    }

    setData({
      mataKuliah: mataKuliah?.payload?.content?.entries,
      shift: shift?.payload?.content?.entries,
      ruangan: ruangan?.payload?.content?.entries
    })
    setIsLoading(false)
  }

  useEffect(() => {
    handleGetData()
  }, [])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name='hari'
          render={({ field }) => (
            <Autocomplete
              loading={isLoading}
              options={hariOptions}
              getOptionLabel={(option: any) => (option ? option : '')}
              renderInput={params => <TextField {...params} label='Hari' placeholder='Pilih Hari' />}
              value={hariOptions.find((item: any) => item === field?.value) || null}
              onChange={(_, value) => {
                field.onChange(value)
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name='shiftId'
          render={({ field }) => (
            <Autocomplete
              loading={isLoading}
              options={data?.shift || []}
              getOptionLabel={(option: any) => (option ? `${option?.startTime} - ${option?.endTime}` : '')}
              renderInput={params => <TextField {...params} label='Shift' placeholder='Pilih Shift' />}
              value={data?.shift?.find((item: any) => item?.id === field?.value) || null}
              onChange={(_, value) => {
                field.onChange(value?.id || null)
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name='matakuliahId'
          render={({ field }) => (
            <Autocomplete
              loading={isLoading}
              options={data?.mataKuliah || []}
              getOptionLabel={(option: any) => (option ? `${option?.nama}` : '')}
              renderInput={params => <TextField {...params} label='Mata Kuliah' placeholder='Pilih Mata Kuliah' />}
              value={data?.mataKuliah?.find((item: any) => item?.id === field?.value) || null}
              onChange={(_, value) => {
                field.onChange(value?.id || null)
              }}
            />
          )}
        />
      </Grid>

      {/* <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name='dosenIds'
          render={({ field }) => (
            <Autocomplete
              loading={isLoading}
              options={data?.dosen || []}
              getOptionLabel={(option: any) => (option ? `${option?.nama}` : '')}
              multiple
              renderInput={params => (
                <TextField {...params} label='Dosen Pengampu' placeholder='Pilih Dosen Pengampu' />
              )}
              value={data?.dosen?.filter((item: any) => (field?.value || []).includes(item?.id)) || []}
              onChange={(_, value) => {
                field.onChange(value?.map((item: any) => item?.id) || [])
              }}
            />
          )}
        />
      </Grid> */}

      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name='ruanganId'
          render={({ field }) => (
            <Autocomplete
              loading={isLoading}
              options={data?.ruangan || []}
              getOptionLabel={(option: any) => (option ? `${option?.nama}` : '')}
              renderInput={params => <TextField {...params} label='Ruangan' placeholder='Pilih Ruangan' />}
              value={data?.ruangan?.find((item: any) => item?.id === field?.value) || null}
              onChange={(_, value) => {
                field.onChange(value?.id || null)
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
