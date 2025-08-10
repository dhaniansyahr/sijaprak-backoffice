import { Icon } from '@iconify/react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

interface IMenuDropdownProps {
  onEdit: () => void
  onDuplicate: () => void
}

export default function MenuDropdown({ onEdit, onDuplicate }: IMenuDropdownProps) {
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
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }} onClick={onEdit}>
          <Icon icon='mdi:edit' />
          <span>Edit Role</span>
        </MenuItem>

        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }} onClick={onDuplicate}>
          <span>Duplicate Role</span>
        </MenuItem>
      </Menu>
    </Box>
  )
}
