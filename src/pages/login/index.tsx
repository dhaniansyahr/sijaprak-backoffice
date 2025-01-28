// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import

// ** MUI Components
import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import themeConfig from 'src/configs/themeConfig'
import { useAuth } from 'src/hooks/useAuth'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const Login = () => {
  const auth = useAuth()
  const { watch, setValue, handleSubmit } = useForm()

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async (value: any) => {
    setIsLoading(true)

    const body: any = Object.assign({}, value)

    auth.login(body, (err: any) => {
      toast.dismiss()
      toast.error(err.response?.data?.message)
      setIsLoading(false)

      return
    })
  }

  return (
    <Box className='content-center'>
      <Card sx={{ width: '100%', maxWidth: '480px', zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box>
                <Image
                  priority
                  src='/images/labdule.jpeg'
                  height='480'
                  width='480'
                  alt='Hero'
                  style={{ height: 'auto', width: '48px' }}
                />
              </Box>
              <Box sx={{ ml: 4 }}>
                <Typography
                  variant='h6'
                  sx={{ mb: 0.5, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}
                >
                  {themeConfig.templateName}
                </Typography>
                <Typography variant='body1'>Backoffice</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
              {`Welcome to ${themeConfig.templateName}! 👋🏻`}
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(handleLogin)}>
            <TextField
              autoFocus
              fullWidth
              id='email'
              label='Email'
              sx={{ mb: 4 }}
              value={watch('email')}
              onChange={e => {
                setValue('email', e.target.value)
              }}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                id='auth-login-password'
                type={isShowPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      aria-label='toggle password visibility'
                    >
                      {isShowPassword ? <Icon icon='mdi:eye-outline' /> : <Icon icon='mdi:eye-off-outline' />}
                    </IconButton>
                  </InputAdornment>
                }
                value={watch('password')}
                onChange={e => {
                  setValue('password', e.target.value)
                }}
              />
            </FormControl>
            <Box sx={{ mb: 4 }} />
            <Button fullWidth type='submit' variant='contained' size='large' sx={{ mb: 7 }} disabled={isLoading}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* <FooterIllustrations /> */}
    </Box>
  )
}

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Login.guestGuard = true

export default Login
