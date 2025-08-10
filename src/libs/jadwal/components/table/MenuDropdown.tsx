import { Icon } from '@iconify/react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import Can from 'src/layouts/components/acl/Can'

interface IMenuDropdownProps {
  onAssignAsisten: () => void
  onEditJadwal: () => void
  onEditPertemuan: () => void
  onDetail: () => void
  onDetailAbsensi: () => void
}

export default function MenuDropdown({
  onAssignAsisten,
  onEditJadwal,
  onEditPertemuan,
  onDetail,
  onDetailAbsensi
}: IMenuDropdownProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(menuAnchorEl)

  const onOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
  }

  const onClose = () => setMenuAnchorEl(null)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={onOpen}>
        <Icon icon='mdi:ellipsis-vertical' />
      </IconButton>
      <Menu
        sx={{ borderRadius: '16px' }}
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={onClose}
        onClick={e => e.stopPropagation()}
      >
        <Can I='assign' a='JADWAL'>
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
            onClick={onAssignAsisten}
          >
            <Icon icon='solar:user-id-broken' />
            <span>Tambahkan Asisten Lab</span>
          </MenuItem>
        </Can>

        <Can I='update' a='JADWAL'>
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
            onClick={onEditJadwal}
          >
            <Icon icon='mdi:edit' />
            <span>Update Jadwal</span>
          </MenuItem>
        </Can>

        <Can I='update' a='JADWAL'>
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
            onClick={onEditPertemuan}
          >
            <Icon icon='mdi:edit' />
            <span>Update Pertemuan</span>
          </MenuItem>
        </Can>

        <Can I='read' a='JADWAL'>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }} onClick={onDetail}>
            <Icon icon='ph:eye' />
            <span>Detail Jadwal</span>
          </MenuItem>
        </Can>

        <Can I='absensi' a='JADWAL'>
          <MenuItem
            sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
            onClick={onDetailAbsensi}
          >
            <Icon icon='mdi:clipboard-text-outline' />
            <span>Detail Absensi</span>
          </MenuItem>
        </Can>
      </Menu>
    </Box>
  )
}
