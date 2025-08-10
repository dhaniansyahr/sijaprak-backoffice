import { Box, useTheme } from '@mui/material'

export default function DrawerContent({ children, fitHeight = false }: { children: any; fitHeight?: boolean }) {
  const { palette } = useTheme()

  return (
    <Box padding={'16px'} height={fitHeight ? 'fit-content' : '100%'}>
      <Box
        display={'flex'}
        width={'100%'}
        height={fitHeight ? 'fit-content' : '100%'}
        flexDirection={'column'}
        padding={'16px '}
        bgcolor={palette.mode === 'light' ? 'white' : '#121212'}
        borderRadius={'16px'}
      >
        {children}
      </Box>
    </Box>
  )
}
