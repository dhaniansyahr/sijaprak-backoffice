// React Imports
import { useEffect, useState, memo, useCallback } from 'react'

// MUI Imports
import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { GridColDef } from '@mui/x-data-grid'
import toast from 'react-hot-toast'

// Utils
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useAppDispatch } from 'src/utils/dispatch'

// Redux Imports
import { getRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import DataTable from 'src/components/shared/table'

const columns: GridColDef[] = [
  {
    flex: 0.25,
    field: 'no',
    headerName: 'No',
    maxWidth: 80,
    sortable: false,
    renderCell: params => <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
  },
  {
    flex: 0.25,
    field: 'nama',
    headerName: 'Nama Kepala Lab',
    sortable: false
  },
  {
    flex: 0.25,
    field: 'nip',
    headerName: 'Nip Kepala Lab',
    sortable: false
  }
]

interface DialogDetailProps {
  dialogRef: React.RefObject<IDialogRef>
  id: string
}

const DialogDetail = memo(({ dialogRef, id }: DialogDetailProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const handleGetData = useCallback(async () => {
    if (!id) return

    setIsLoading(true)

    try {
      // @ts-ignore
      const res = await dispatch(getRuanganLaboratorium({ id }))

      if (res.meta.requestStatus !== 'fulfilled') {
        toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message)

        return
      }

      const content = {
        ...res?.payload?.content,
        entries: res?.payload?.content?.historyLabs
      }

      setData(content)
    } catch (error) {
      toast.error('Gagal mengambil data detail')
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id) {
      handleGetData()
    }
  }, [handleGetData])

  return (
    <Dialog ref={dialogRef} title='Detail Ruangan Laboratorium' customAction={<></>}>
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} borderBottom={`1px solid ${hexToRGBA('#4C4E64', 0.2)}`} paddingBottom='8px'>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <Typography variant='body1' fontWeight='bold'>
                  Nama Ruangan
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant='body1'>{data?.nama || '-'}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} borderBottom={`1px solid ${hexToRGBA('#4C4E64', 0.2)}`} paddingBottom='8px'>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <Typography variant='body1' fontWeight='bold'>
                  Lokasi Ruangan
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant='body1'>{data?.lokasi || '-'}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <DataTable data={data?.historyLabs ?? []} columns={columns} isLoading={isLoading} />
          </Grid>
        </Grid>
      )}
    </Dialog>
  )
})

DialogDetail.displayName = 'DialogDetail'

export default DialogDetail
