import { Icon } from '@iconify/react'
import { Grid, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import DialogForgotPassword from '../dialog/DialogForgotPassword'

export default function LoginForm() {
  const auth = useAuth()
  const theme = useTheme()

  const { watch, setValue, handleSubmit } = useForm()

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDialogForgotPasswordOpen, setIsDialogForgotPasswordOpen] = useState<boolean>(false)

  const handleLogin = async (value: any, isSSO: boolean) => {
    setIsLoading(true)

    const body = Object.assign({}, value)

    auth.login(body, (err: any) => {
      toast.dismiss()
      toast.error(err.response?.data?.message)
      setIsLoading(false)

      return
    })
  }

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: '56px',
          background: '#F7F7F9'
        }}
      >
        <Typography variant='h4' color={'primary'} sx={{ fontWeight: 500, textAlign: 'center' }}>
          Get Started
        </Typography>
        <Box sx={{ mb: 6 }}>
          <Typography variant='body1' color={'primary'} sx={{ textAlign: 'center' }}>
            You need to fill in your email and password
          </Typography>
        </Box>
        <form
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit((value: any) => {
            handleLogin(value, false)
          })}
        >
          <TextField
            autoFocus
            fullWidth
            id='identity'
            label='NIP/NPM/Email'
            sx={{
              mb: 4,
              borderRadius: '16px',

              //change the color of the textfield to black
              '& .MuiInputBase-input': {
                color: 'black'
              },

              //change color of the label when not focused
              '& .MuiInputLabel-root': {
                color: 'grey'
              },

              //change border color
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white !important',
                '& fieldset': {
                  borderColor: '#4C4E6438'
                },
                '&:hover ': {
                  borderColor: '#4C4E6438'
                }
              }
            }}
            value={watch('identity')}
            onChange={e => {
              setValue('identity', e.target.value)
            }}
          />
          <FormControl
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                color: 'black'
              },

              //change color of the label when not focused
              '& .MuiInputLabel-root': {
                color: 'grey'
              },

              //change border color
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4C4E6438'
                },
                '&:hover ': {
                  borderColor: '#4C4E6438'
                }
              }
            }}
          >
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
              sx={{
                background: theme.palette.common.white

                //change the color of the textfield to black
              }}
              value={watch('password')}
              onChange={e => {
                setValue('password', e.target.value)
              }}
            />
          </FormControl>
          <Box sx={{ mb: 4 }} />
          <Button
            fullWidth
            color='primary'
            type='submit'
            variant='contained'
            size='large'
            sx={{
              mb: 2,
              backgroundColor: '#182435',
              color: 'white',
              '&:hover': {
                backgroundColor: '#182439 !important'
              }
            }}
            disabled={isLoading}
          >
            Login
          </Button>

          <Typography
            sx={{
              textAlign: 'end',
              color: 'text.lightSecondary',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            onClick={() => setIsDialogForgotPasswordOpen(true)}
          >
            Forgot password?
          </Typography>
        </form>
      </Box>
      <DialogForgotPassword open={isDialogForgotPasswordOpen} onClose={() => setIsDialogForgotPasswordOpen(false)} />
    </Grid>
  )
}
