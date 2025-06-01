import { Box, CardHeader, Typography } from '@mui/material'

interface IHeaderPageProps {
  title: string
}

const HeaderPage = ({ title }: IHeaderPageProps) => {
  return (
    <CardHeader
      title={
        <Box>
          <Typography variant='h4' fontWeight={500}>
            {title}
          </Typography>
        </Box>
      }
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'start', md: 'center' },
        borderBottom: '1px solid #f4f4f4'
      }}
    />
  )
}

export default HeaderPage
