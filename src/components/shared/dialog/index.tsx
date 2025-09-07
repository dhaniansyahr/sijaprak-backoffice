import React, { forwardRef, ReactElement, Ref, useCallback, useImperativeHandle, useState } from 'react'
import {
  Dialog as MuiDialog,
  DialogContent,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Fade,
  FadeProps,
  Grid,
  Button,
  Divider,
  DialogTitle,
  DialogProps
} from '@mui/material'
import { Icon } from '@iconify/react'
import { LoadingButton } from '@mui/lab'

export interface IDialogRef {
  open: () => void
  close: () => void
  isOpen: boolean
}

interface CustomDialogProps extends Omit<DialogProps, 'open'> {
  title?: string
  isLoading?: boolean
  onSubmit?: () => void
  customAction?: React.ReactNode
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const Dialog = forwardRef<IDialogRef, CustomDialogProps>((props, ref) => {
  const { title = '', children, isLoading = false, onSubmit, customAction, ...muiDialogProps } = props

  const [isOpen, setIsOpen] = useState(false)

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      isOpen
    }),
    [isOpen]
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
      {...muiDialogProps}
    >
      <DialogTitle
        sx={{
          mb: 6,
          px: '20px',
          backgroundColor: 'primary.dark',
          display: 'flex',
          justifyContent: title ? 'space-between' : 'flex-end',
          alignItems: 'center'
        }}
      >
        {title && (
          <Typography variant='h5' color='white'>
            {title}
          </Typography>
        )}

        <IconButton onClick={() => setIsOpen(false)}>
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
                      <Button
                        variant='outlined'
                        color='secondary'
                        type='button'
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                      >
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
})

Dialog.displayName = 'Dialog'

export default Dialog
