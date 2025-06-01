// React Imports
import React from 'react'

// MUI Imports
import { CircularProgress, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, gridClasses } from '@mui/x-data-grid'

// Third Party Imports
import { Icon } from '@iconify/react'

// Utils
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { IDialogProps } from 'src/utils/response.utils'
import { useAppDispatch } from 'src/utils/dispatch'

// Redux Imports
import { setIsRefresh } from 'src/stores/laboratorium/slice'
import { THistoryLabs } from 'src/stores/laboratorium/types'
import { useGetRuangan } from 'src/stores/laboratorium/service'
import { useHistoryLab } from '../../hook/useHistoryLab'
import TransitionDialog from 'src/components/shared/dialog/dialog-transition'
import HeaderDialog from 'src/components/shared/dialog/dialog-header'

const Transition = TransitionDialog

const DialogDetailRuanganLaboratorium = ({ open, onClose, values }: IDialogProps) => {
  const dispatch = useAppDispatch()

  const { data, isLoadData } = useGetRuangan(values?.id)

  const { columns } = useHistoryLab()

  const handleClose = () => {
    onClose()

    // @ts-ignore
    dispatch(setIsRefresh())
  }

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
        {isLoadData ? (
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
                loading={isLoadData}
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
