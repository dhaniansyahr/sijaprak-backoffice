import { Icon } from '@iconify/react'
import { Box, DialogTitle, IconButton, Typography } from '@mui/material'

interface IHeaderDialogProps {
  onClose: () => void
  title: string
  description?: string
}

const HeaderDialog = ({ onClose, title, description }: IHeaderDialogProps) => {
  return (
    <DialogTitle sx={{ mb: 6, px: { xs: 8, sm: 15 }, position: 'relative', backgroundColor: 'primary.dark' }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
        <Icon icon='material-symbols:close' color='white' />
      </IconButton>
      <Box>
        <Typography variant='h5' color={'white'}>
          {title}
        </Typography>
        {description && <Typography color={'white'}>{description}</Typography>}
      </Box>
    </DialogTitle>
  )
}

export default HeaderDialog
