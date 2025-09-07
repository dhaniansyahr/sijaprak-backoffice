import { Button, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Dialog, { IDialogRef } from 'src/components/shared/dialog'

interface IDialogProps {
  dialogRef: React.RefObject<IDialogRef>
  onManual: () => void
  onGenerate: () => void
}

const DialogCreateOptions = ({ dialogRef, onManual, onGenerate }: IDialogProps) => {
  return (
    <Dialog ref={dialogRef} title='Tambah Jadwal Praktikum' maxWidth={'sm'} customAction={<></>}>
      <Grid container spacing={2}>
        <Grid item xs={12} paddingBottom={'16px'}>
          <Typography variant='h5' align='center'>
            Pilih cara untuk menambahkankan jadwal praktikum?
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button variant='contained' color='primary' onClick={onManual} size='large' fullWidth>
                Manual
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant='contained' color='primary' onClick={onGenerate} size='large' fullWidth>
                Otomatis
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default DialogCreateOptions
