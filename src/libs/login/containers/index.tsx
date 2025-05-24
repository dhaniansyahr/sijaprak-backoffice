import { Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Image from 'next/image'
import LoginForm from 'src/libs/login/components/section/LoginForm'

export default function LoginPage() {
  return (
    <Box sx={{ p: '0 !important', overflow: 'hidden' }}>
      <Box minHeight={'100vh'}>
        <Grid container sx={{ height: '100vh' }}>
          <Grid item sm={6} lg={8} position={'relative'} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Image
              src={`/images/bg-login.jpg`}
              alt='Auth page background'
              width={1000}
              height={800}
              style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute' }}
            />
            <Box
              zIndex={1}
              position={'relative'}
              p={'40px'}
              width={'100%'}
              height={'100%'}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'flex-end'}
              gap={3}
            >
              <Box>
                <Image
                  src={'/images/logo-color.png'}
                  alt='Adhi CRM+'
                  width={240}
                  height={240}
                  style={{ height: '80px', width: 'auto' }}
                />
              </Box>
              <Typography variant='h3' color='primary' fontWeight={500}>
                Welcome to Informatika TMS
              </Typography>
              <Typography variant='h6' color='primary' fontWeight={400} mb={4}>
                AI-Powered Timetable Management Sytems
              </Typography>
            </Box>
          </Grid>
          <LoginForm />
        </Grid>
      </Box>
    </Box>
  )
}
