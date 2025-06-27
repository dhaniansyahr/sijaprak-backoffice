// React Imports
import React, { useEffect, useState } from 'react'

// MUI Imports
import { CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid'

// Utils
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { IDialogProps } from 'src/utils/response.utils'
import { useAppDispatch } from 'src/utils/dispatch'

// Redux Imports
import { THistoryLabs } from 'src/stores/laboratorium/types'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'
import { getRuanganLaboratorium } from 'src/stores/laboratorium/action'
import toast from 'react-hot-toast'

const Transition = TransitionDialog

const columns: GridColDef[] = [
  {
    flex: 0.25,
    field: 'no',
    headerName: 'No',
    maxWidth: 80,
    sortable: false,
    renderCell: params => {
      return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
    }
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

  // {
  //   flex: 0.25,
  //   field: 'jabatan',
  //   headerName: 'Masa Jabatan',
  //   sortable: false
  // }
]

const DialogDetailRuanganLaboratorium = ({ open, onClose, values }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const handleGetData = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getRuanganLaboratorium({ id: values?.id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)
        toast.error(res.payload.response.data?.errors?.[0]?.message || res.payload.response?.data?.message)

        return
      }

      setIsLoading(false)
      setData(res.payload.content)
    })
  }

  useEffect(() => {
    if (open) {
      handleGetData()
    }
  }, [values?.id, open])

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: '0px'
        }
      }}
    >
      <HeaderDialog title='Detail Ruangan Laboratorium' onClose={onClose} />

      <DialogContent
        sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
        style={{ paddingTop: '5px' }}
      >
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
              <DataGrid<THistoryLabs>
                autoHeight
                rows={data?.historyLabs ?? []}
                columns={columns}
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                hideFooter
                loading={isLoading}
                slots={{
                  loadingOverlay: CircularProgress
                }}
                sx={{
                  [`& .${gridClasses.cell}`]: {
                    py: 1
                  }
                }}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogDetailRuanganLaboratorium
