import { Icon } from '@iconify/react'
import { IconButton, Menu } from '@mui/material'
import React from 'react'

interface ActionTableProps {
  id: string
  open: string
  onOpen: () => void
  onClose: () => void
  children: JSX.Element | React.ReactNode
}

export default function ActionTable(props: ActionTableProps) {
  const { id, open, onOpen, onClose, children } = props

  return (
    <div>
      <IconButton id={id} onClick={onOpen}>
        <Icon icon='mage:dots' />
      </IconButton>
      <Menu
        id={id}
        anchorEl={document.getElementById(id)}
        open={open === id}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': id
        }}
      >
        {children}
      </Menu>
    </div>
  )
}
