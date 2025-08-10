import { Box, useTheme } from '@mui/material'

export default function DrawerContainer({
  children,
  fitHeight = false,
  customMaxWidth,
  customMinWidth
}: {
  children: any
  fitHeight?: boolean
  customMaxWidth?: string
  customMinWidth?: string
}) {
  const { palette } = useTheme()

  return (
    <Box
      sx={{
        width: '100%',
        height: fitHeight ? 'auto' : '100%',
        minWidth: { md: customMinWidth ?? '500px' },
        maxWidth: { xs: '100%', md: customMaxWidth ?? '600px' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white'
      }}
    >
      {children}
    </Box>
  )
}
