import Grid from '@mui/material/Grid'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { useAssignAsisten } from '../../hooks/useAssignAssiten'
import DataTable from 'src/components/shared/table'

interface IDialogProps {
  dialogRef: React.RefObject<IDialogRef>
  id: string
}

const DialogAssignAsistenLab = ({ dialogRef, id }: IDialogProps) => {
  const { columns, data, isLoading } = useAssignAsisten(id, dialogRef)

  return (
    <Dialog ref={dialogRef} title='Assign Asisten Lab' maxWidth='md' fullWidth>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DataTable data={data || []} columns={columns} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default DialogAssignAsistenLab
