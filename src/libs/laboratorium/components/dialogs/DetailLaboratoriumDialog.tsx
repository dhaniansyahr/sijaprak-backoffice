import { Icon } from '@iconify/react'
import { CircularProgress, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import React, { ReactElement, Ref, forwardRef, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DetailLaboratoriumDialog = ({ open, onClose, values }: any) => {
  const [isLoading, setIsLoading] = useState(false)

  const [data, setData] = useState<any>(null)

  const handleClose = () => {
    setIsLoading(false)
    onClose(false)

    // @ts-ignore
  }

  const columns = [
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
      field: 'nama',
      headerName: 'Nama Kepala Lab',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.nama}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nip',
      headerName: 'Nip Kepala Lab',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.nip}</span>
      }
    },
    {
      flex: 0.25,
      field: 'jabatan',
      headerName: 'Masa Jabatan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.masaJabatan}</span>
      }
    }
  ]

  useEffect(() => {
    setData({
      entries: [
        { id: 1, nama: 'John Doe', nip: '123456789', masaJabatan: '2020-2022' },
        { id: 2, nama: 'Jane Doe', nip: '987654321', masaJabatan: '2018-2020' },
        { id: 3, nama: 'Alex Smith', nip: '555555555', masaJabatan: '2015-2018' }
      ],
      totalData: 3
    })
  }, [open])

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' TransitionComponent={Transition}>
      <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: '#F7F7F9' }}>
        <IconButton
          onClick={() => {
            handleClose()
          }}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='material-symbols:close' />
        </IconButton>
        <Box>
          <Typography variant='h5'>Detail Ruangan Laboratorium</Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
        style={{ paddingTop: '5px' }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} borderBottom={`1px solid ${hexToRGBA('#4C4E64', 0.2)}`} paddingBottom='8px'>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <Typography variant='body1' fontWeight='bold'>
                  Nama Ruangan:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant='body1'>{values?.nama}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} borderBottom={`1px solid ${hexToRGBA('#4C4E64', 0.2)}`} paddingBottom='8px'>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <Typography variant='body1' fontWeight='bold'>
                  Lokasi Ruangan:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant='body1'>{values?.lokasi}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <DataGrid
              autoHeight
              rows={data?.entries ?? []}
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
      </DialogContent>
    </Dialog>
  )
}

export default DetailLaboratoriumDialog
