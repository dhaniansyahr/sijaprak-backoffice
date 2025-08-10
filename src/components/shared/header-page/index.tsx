import { Icon } from '@iconify/react'
import { Box, CardHeader, CardHeaderProps, IconButton, Typography } from '@mui/material'
import { NextRouter, useRouter } from 'next/router'

interface IHeaderPageProps extends CardHeaderProps {
  title: string
  icon?: string
}

const HeaderPage = (props: IHeaderPageProps) => {
  const { title, icon, ...rest } = props

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
          <Typography variant='h5' fontWeight={500}>
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
      {...rest}
    />
  )
}

export default HeaderPage
