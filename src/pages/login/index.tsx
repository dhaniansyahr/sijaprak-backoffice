import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import LoginPage from 'src/libs/login/containers'

const Login = () => {
  return <LoginPage />
}

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Login.guestGuard = true

export default Login
