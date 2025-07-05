// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import - Dynamically loaded
const Toaster = dynamic(() => import('react-hot-toast').then(mod => ({ default: mod.Toaster })), {
  ssr: false
})

// ** Component Imports - Core ones stay, heavy ones go dynamic
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import Spinner from 'src/@core/components/spinner'

// ** Dynamic imports for heavy components
const UserLayout = dynamic(() => import('src/layouts/UserLayout'), {
  loading: () => <Spinner />,
  ssr: false
})

const AclGuard = dynamic(() => import('src/@core/components/auth/AclGuard'), {
  loading: () => <Spinner />,
  ssr: false
})

const AuthGuard = dynamic(() => import('src/@core/components/auth/AuthGuard'), {
  loading: () => <Spinner />,
  ssr: false
})

const GuestGuard = dynamic(() => import('src/@core/components/auth/GuestGuard'), {
  loading: () => <Spinner />,
  ssr: false
})

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components - Dynamic
const ReactHotToast = dynamic(() => import('src/@core/styles/libs/react-hot-toast'), {
  ssr: false
})

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Essential styles only - others load dynamically
import '../../styles/globals.css'

// ** CSS imports for required libraries
import 'prismjs/themes/prism-tomorrow.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'react-datepicker/dist/react-datepicker.css'

// ** React-Redux
import { Provider } from 'react-redux'
import { store } from 'src/stores'

// ** Load heavy resources dynamically on client side
if (typeof window !== 'undefined') {
  // Load iconify bundle dynamically
  import('src/iconify-bundle/icons-bundle-react').catch(() => {})

  // Load moment locale dynamically
  import('moment')
    .then(() => {
      // @ts-ignore
      require('moment/locale/id')
    })
    .catch(() => {})

  // Load prism components dynamically
  import('prismjs')
    .then(() => {
      // @ts-ignore
      require('prismjs/components/prism-jsx')

      // @ts-ignore
      require('prismjs/components/prism-tsx')
    })
    .catch(() => {})
}

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta name='description' content={`${themeConfig.templateName} - Sistem Penjadwalan Praktikum`} />
          <meta name='keywords' content={`${themeConfig.templateName}`} />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
          {/* Preload critical resources */}
          <link rel='preload' href='/_next/static/css/app.css' as='style' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='dns-prefetch' href='https://fonts.gstatic.com' />
        </Head>

        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                      <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                        {getLayout(<Component {...pageProps} />)}
                      </AclGuard>
                    </Guard>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
