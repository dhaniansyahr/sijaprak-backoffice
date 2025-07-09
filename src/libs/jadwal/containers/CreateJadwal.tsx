import { Box, Button, Card, CardContent, CircularProgress, Divider, Grid } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import DialogConflict from '../components/dialogs/DialogConflict'
import HeaderPage from 'src/components/shared/header-page'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import FormJadwal from '../components/form'
import { useAppDispatch } from 'src/utils/dispatch'
import { createJadwal, getAvailableJadwal } from 'src/stores/jadwal/action'
import toast from 'react-hot-toast'
import DataTable from 'src/components/shared/table'
import Can from 'src/layouts/components/acl/Can'
import { DialogRef } from 'src/components/shared/dialog'
import DialogConfirmation from 'src/components/shared/confirmation-dialog'

export const hariOptions = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU']

export default function CreateJadwal() {
  const router = useRouter()

  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [availableJadwal, setAvailableJadwal] = useState<any>(null)

  const conflictRef = useRef<DialogRef>(null)
  const confirmationRef = useRef<DialogRef>(null)

  const [isConflicting, setIsConflicting] = useState(false)
  const [isConfirmating, setIsConfirmating] = useState(false)

  const [conflictFormData, setConflictFormData] = useState<any>(null)

  const { control, handleSubmit, setValue } = useForm<any>({
    defaultValues: {
      hari: null,
      shiftId: null,
      matakuliahId: null,
      dosenIds: [],
      ruanganId: null
    }
  })

  const handleGetAvailableJadwal = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getAvailableJadwal({ data: {} })).then((res: any) => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        return
      }

      setIsLoading(false)
      setAvailableJadwal(res.payload.content)
    })
  }

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 80,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'day',
      headerName: 'Hari',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'shift',
      headerName: 'Shift',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <span>
            {params?.row?.shift?.startTime || '-'} - {params?.row?.shift?.endTime || '-'}
          </span>
        )
      }
    },
    {
      flex: 0.25,
      field: 'roomName',
      headerName: 'Ruangan',
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.room?.name ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'Aksi',

      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box>
            <Button
              variant='contained'
              size='small'
              onClick={() => {
                setValue('hari', params?.row?.day || null)
                setValue('shiftId', params?.row?.shift?.id || null)
                setValue('ruanganId', params?.row?.room?.id || null)
              }}
            >
              Pilih
            </Button>
          </Box>
        )
      }
    }
  ]

  const createJadwalRequest = async (formData: any, isOverride = false) => {
    const body = Object.assign({}, formData, {
      isOverride: isOverride
    })

    // @ts-ignore
    return await dispatch(createJadwal({ data: body }))
  }

  const onSubmit = handleSubmit(async value => {
    setIsConfirmating(true)

    try {
      const res = await createJadwalRequest(value)

      if (res.meta.requestStatus !== 'fulfilled') {
        // Check if it's a 409 conflict error
        if (res.payload?.response?.status === 409 || res.payload?.status === 409) {
          setIsConfirmating(false)

          // Show conflict dialog
          setConflictFormData(value)
          conflictRef.current?.open()

          return
        }

        setIsConfirmating(false)

        toast.error(res?.payload?.message || 'Terjadi kesalahan saat membuat jadwal')

        return
      }

      setIsConfirmating(false)

      toast.success(res?.payload?.message || 'Jadwal berhasil dibuat')
      router.back()
    } catch (error: any) {
      setIsConfirmating(false)

      toast.error('Terjadi kesalahan saat membuat jadwal')
    }
  })

  const handleOverrideSubmit = async () => {
    setIsConflicting(true)

    try {
      const res = await createJadwalRequest(conflictFormData, true)

      if (res.meta.requestStatus !== 'fulfilled') {
        setIsConflicting(false)

        toast.error(res?.payload?.message || 'Terjadi kesalahan saat override jadwal')

        return
      }

      setIsConflicting(false)

      toast.success(res?.payload?.message || 'Jadwal berhasil dibuat dengan override')

      router.back()
    } catch (error: any) {
      setIsConflicting(false)

      toast.error('Terjadi kesalahan saat override jadwal')
    }
  }

  const onPaginationModelChange = (newModel: any) => {
    setAvailableJadwal((prev: any) => ({ ...prev, page: newModel.page + 1, pageSize: newModel.pageSize }))
  }

  return (
    <Card sx={{ padding: '16px' }}>
      <HeaderPage
        icon='meteor-icons:arrow-left'
        title='Tambah Jadwal Praktikum Baru'
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Can I={'read'} a={'JADWAL'}>
              <Button variant='outlined' color='secondary' onClick={() => router.back()}>
                Cancel
              </Button>

              <LoadingButton
                variant='contained'
                color='primary'
                onClick={() => confirmationRef.current?.open()}
                loadingIndicator={<CircularProgress size={20} />}
              >
                Submit
              </LoadingButton>
            </Can>
          </Box>
        }
      />

      <CardContent sx={{ padding: '24px !important' }}>
        <Grid container spacing={4}>
          <FormJadwal control={control} />
        </Grid>
      </CardContent>

      <Divider />

      <CardContent sx={{ padding: '24px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <LoadingButton
              variant='outlined'
              color='success'
              onClick={() => handleGetAvailableJadwal()}
              loading={isLoading}
              loadingIndicator={<CircularProgress size={20} />}
            >
              Daftar Jadwal Kosong
            </LoadingButton>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <DataTable
              data={availableJadwal?.availableSchedules}
              columns={columns}
              page={1}
              pageSize={10}
              isLoading={isLoading}
              onPaginationModelChange={onPaginationModelChange}
            />
          </Grid>
        </Grid>
      </CardContent>

      <DialogConfirmation
        dialogRef={confirmationRef}
        onConfirm={onSubmit}
        isLoading={isConfirmating}
        title='Apakah semua data terisi dengan benar?'
        message='Pastikan dan konfirmasikan keakuratan data perubahan yang Anda buat'
        onCancel={() => confirmationRef.current?.close()}
        confirmText='Submit'
        cancelText='Batal'
      />

      <DialogConflict dialogRef={conflictRef} onSubmit={handleOverrideSubmit} isLoading={isConflicting} />
    </Card>
  )
}
