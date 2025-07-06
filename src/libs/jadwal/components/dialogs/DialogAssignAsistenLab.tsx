import { DataGrid, gridClasses } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog, { DialogRef } from 'src/components/shared/dialog'
import { useAssignAsisten } from '../../hooks/useAssignAssiten'

interface IDialogProps {
  dialogRef: React.RefObject<DialogRef>
  id: string
}

const DialogAssignAsistenLab = ({ dialogRef, id }: IDialogProps) => {
  const { columns, data, isLoading } = useAssignAsisten(id, dialogRef)

  return (
    <Dialog
      ref={dialogRef}
      isOpen={dialogRef.current?.isOpen ?? false}
      onChange={open => {
        if (!open) {
          dialogRef.current?.close()
        }
      }}
      title='Assign Asisten Lab'
      maxWidth='md'
      fullWidth
    >
      {() => (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <DataGrid
              autoHeight
              rows={data || []}
              columns={columns}
              pagination
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
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 600
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            />
          </Grid>
        </Grid>
      )}
    </Dialog>
  )
}

export default DialogAssignAsistenLab
