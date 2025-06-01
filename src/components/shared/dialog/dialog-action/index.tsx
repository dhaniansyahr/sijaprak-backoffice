import { LoadingButton } from '@mui/lab'
import { Button, CircularProgress } from '@mui/material'

import { Box } from '@mui/material'

import { DialogActions } from '@mui/material'

interface IActionDialogProps {
  isLoading: boolean
  onClose: () => void
}

const ActionDialog = ({ isLoading, onClose }: IActionDialogProps) => {
  return (
    <DialogActions sx={{ pb: { xs: 8, sm: 10 }, justifyContent: 'end', px: { xs: 8, sm: 15 } }}>
      <Box display='flex' gap={4}>
        <Button variant='contained' color='secondary' size='medium' disabled={isLoading} onClick={onClose}>
          Batal
        </Button>
        <LoadingButton
          loading={isLoading}
          loadingIndicator={<CircularProgress size={20} />}
          type='submit'
          variant='contained'
          disabled={isLoading}
        >
          Simpan
        </LoadingButton>
      </Box>
    </DialogActions>
  )
}

export default ActionDialog
