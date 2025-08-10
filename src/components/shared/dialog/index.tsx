import React, { forwardRef, ReactElement, Ref, useCallback, useImperativeHandle, useState } from 'react'
import {
  Dialog as MuiDialog,
  DialogContent,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  DialogProps,
  Fade,
  FadeProps,
  Grid,
  Button,
  Divider,
  DialogTitle
} from '@mui/material'
import { Icon } from '@iconify/react'
import { LoadingButton } from '@mui/lab'

export interface IDialogProps extends Omit<Partial<DialogProps>, 'children' | 'open' | 'onClose' | 'onChange'> {
  isOpen?: boolean
  onChange?: (value: boolean) => void
  children: React.ReactNode
  title?: string
  onClose?: () => void
  isLoading?: boolean
  className?: string
  customAction?: React.ReactNode
  onSubmit?: () => void
}

export interface IDialogRef {
  open: () => void
  close: () => void
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const Dialog = forwardRef<IDialogRef, IDialogProps>(
  (
    {
      isOpen: controlledIsOpen,
      onChange,
      children,
      title,
      onClose,
      onSubmit,
      isLoading,
      className,
      customAction,
      ...props
    },
    ref
  ) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false)

    // Use controlled state if provided, otherwise use internal state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
    const setIsOpen = useCallback(
      (value: React.SetStateAction<boolean>) => {
        if (controlledIsOpen !== undefined) {
          // For controlled mode, we only support boolean values
          const newValue = typeof value === 'function' ? value(controlledIsOpen) : value
          onChange?.(newValue)
        } else {
          // For uncontrolled mode, use the internal setter
          setInternalIsOpen(value)
        }
      },
      [controlledIsOpen, onChange]
    )

    const open = useCallback(() => setIsOpen(true), [setIsOpen])
    const close = useCallback(() => setIsOpen(false), [setIsOpen])

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
        isOpen,
        setIsOpen
      }),
      [open, close, isOpen, setIsOpen]
    )

    return (
      <MuiDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth='md'
        scroll='body'
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: '0px'
          }
        }}
        {...props}
      >
        <DialogTitle
          sx={{
            mb: 6,
            px: '20px',
            backgroundColor: 'primary.dark',
            display: 'flex',
            justifyContent: title !== '' || title ? 'space-between' : 'end',
            alignItems: 'center'
          }}
        >
          {title && (
            <Typography variant='h5' color={'white'}>
              {title}
            </Typography>
          )}

          <IconButton onClick={close}>
            <Icon icon='material-symbols:close' color='white' />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            padding: '20px',
            backgroundColor: 'transparent'
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                height: '128px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CircularProgress size={40} />
            </Box>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault()
                onSubmit?.()
              }}
            >
              <Box sx={{ padding: '16px' }}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    {children}
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {customAction ? (
                    customAction
                  ) : (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                        <Button variant='outlined' color='secondary' type='button' onClick={close} disabled={isLoading}>
                          Batal
                        </Button>
                        <LoadingButton
                          variant='contained'
                          color='primary'
                          type='submit'
                          loading={isLoading}
                          loadingIndicator={<CircularProgress />}
                          disabled={isLoading}
                        >
                          Submit
                        </LoadingButton>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </form>
          )}
        </DialogContent>
      </MuiDialog>
    )
  }
)

Dialog.displayName = 'Dialog'

export default Dialog
