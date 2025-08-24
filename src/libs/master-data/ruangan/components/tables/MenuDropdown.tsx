import { Icon } from '@iconify/react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import Can from 'src/layouts/components/acl/Can'

interface IMenuDropdownProps {
  onDetail: () => void
  onEdit: () => void
  onChange: () => void
}

export default function MenuDropdown({ onDetail, onEdit, onChange }: IMenuDropdownProps) {
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
        <Can I={'read'} a={'RUANGAN'}>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }} onClick={onDetail}>
            <Icon icon='ph:eye' />
            <span>Detail</span>
          </MenuItem>
        </Can>

        <Can I={'update'} a={'RUANGAN'}>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }} onClick={onEdit}>
            <Icon icon='mdi:edit' />
            <span>Update Ruangan</span>
          </MenuItem>
        </Can>

        <Can I={'change_kepala_lab'} a={'RUANGAN'}>
          <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }} onClick={onChange}>
            <Icon icon='ph:user-circle-gear' />
            <span>Ganti Kepala Lab</span>
          </MenuItem>
        </Can>
      </Menu>
    </Box>
  )
}
