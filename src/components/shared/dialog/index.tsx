import React from 'react'
import { Dialog as MuiDialog, DialogContent, DialogActions, useTheme, useMediaQuery } from '@mui/material'
import TransitionDialog from './dialog-transition'
import HeaderDialog from './dialog-header'

// Transition component for smooth dialog animation
const Transition = TransitionDialog

export interface DialogProps {
  isOpen: boolean
  onChange?: (value: boolean) => void
  children: (close: () => void) => React.ReactNode
  title?: React.ReactNode
  footer?: (close: () => void) => React.ReactNode
  withClose?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fullWidth?: boolean
  fullScreen?: boolean
  disableBackdropClick?: boolean
  disableEscapeKeyDown?: boolean
}

export type DialogRef = {
  open: () => void
  close: () => void
  isOpen: boolean
}

const Dialog = React.forwardRef<DialogRef, DialogProps>((props, ref) => {
  const {
    onChange,
    children,
    title,
    footer,
    withClose = true,
    maxWidth = 'sm',
    fullWidth = true,
    fullScreen = false,
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    ...rest
  } = props

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [isOpen, setIsOpen] = React.useState(props.isOpen || false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])

  React.useImperativeHandle(ref, () => ({
    open,
    close,
    isOpen
  }))

  React.useEffect(() => {
    if (typeof props.isOpen === 'boolean') {
      setIsOpen(props.isOpen)
    }
  }, [props.isOpen])

  React.useEffect(() => {
    onChange?.(isOpen)
  }, [isOpen, onChange])

  const handleClose = (_: any, reason: string) => {
    if (disableBackdropClick && reason === 'backdropClick') return
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') return
    close()
  }

  const haveHeader = withClose || title

  return (
    <MuiDialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen || isMobile}
      PaperProps={{
        sx: {
          borderRadius: '0px',
          boxShadow: theme.shadows[10]
        }
      }}
      {...rest}
    >
      {haveHeader && <HeaderDialog onClose={() => close()} title={title as string} />}

      <DialogContent
        sx={{ pb: 6, px: { xs: 8, sm: 10 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}
        style={{ paddingTop: '5px' }}
      >
        {children(close)}
      </DialogContent>

      {footer && (
        <DialogActions
          sx={{
            padding: theme.spacing(2, 3, 3, 3),
            borderTop: `1px solid ${theme.palette.divider}`,
            gap: theme.spacing(2)
          }}
        >
          {footer(close)}
        </DialogActions>
      )}
    </MuiDialog>
  )
})

Dialog.displayName = 'Dialog'

export default Dialog
