import { Icon } from '@iconify/react'
import { Box, CardHeader, IconButton, Typography } from '@mui/material'
import { NextRouter, useRouter } from 'next/router'

interface IHeaderPageProps {
  title: string
  icon?: string
}

const HeaderPage = ({ title, icon }: IHeaderPageProps) => {
  const router: NextRouter = useRouter()

  return (
    <CardHeader
      title={
        <Box display='flex' alignItems='center' gap={2}>
          {icon && (
            <IconButton
              sx={{
                transform: 'translateX(-5px)',
                transition: 'transform 0.3s'
              }}
              onClick={() => router.back()}
            >
              <Icon icon='meteor-icons:arrow-left' />
            </IconButton>
          )}
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
