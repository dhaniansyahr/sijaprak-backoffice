// ** MUI Imports
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useAuth } from 'src/hooks/useAuth'
import navigation from 'src/navigation/vertical'
import { getTitleByPath } from 'src/utils/string.format'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, toggleNavVisibility } = props

  const { user } = useAuth()

  // const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const router = useRouter()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}

        <Typography variant='h6' sx={{ color: 'white' }}>
          {getTitleByPath(navigation(), router.pathname)} - Sistem Penjadwalan Praktikum
        </Typography>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body2' sx={{ color: 'white' }}>
              {user?.fullName || '-'}
            </Typography>
            <Typography variant='body2' sx={{ color: 'white' }}>
              {/* {user?. || "-"}               */}
            </Typography>
          </Box>
          <UserDropdown settings={settings} />
        </Box>
      </Box>
    </Box>
  )
}

export default AppBarContent
