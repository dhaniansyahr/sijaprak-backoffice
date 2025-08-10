// React Import
import React, { useState, memo, useCallback, useEffect } from 'react'

// Third Party
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// Services & Types
import { useAppDispatch } from 'src/utils/dispatch'

// Redux Imports
import { setIsRefresh } from 'src/stores/master-data/ruangan/slice'
import { createRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'

// Components
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { Autocomplete, FormHelperText, Grid, IconButton, InputAdornment, TextField } from '@mui/material'
import { InputMask } from 'src/components/shared/input/InputMask'
import { Icon } from '@iconify/react'
import { getAllRole } from 'src/stores/role/action'

interface DialogCreateProps {
  dialogRef: React.RefObject<IDialogRef>
}

const DialogAdd = memo(({ dialogRef }: DialogCreateProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false)

  const [roles, setRoles] = useState<any[]>([])
  const [isLoadRole, setIsLoadRole] = useState(false)

  const { control, reset, handleSubmit, setError } = useForm<any>({
    defaultValues: {
      nama: '',
      lokasi: ''
    }
  })

  const handleClose = useCallback(() => {
    reset()

    dialogRef.current?.close()
    dispatch(setIsRefresh())
  }, [reset, dialogRef, dispatch])

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)

    // @ts-ignore
    const res = await dispatch(createRuanganLaboratorium({ data: value }))
      .then(res => {
        if (res.meta.requestStatus !== 'fulfilled') {
          const errors = res.payload.response.data?.errors || []

          errors.forEach((error: any) => {
            setError(error.field, { message: error.message })
          })

          toast.error(errors?.[0]?.message || res.payload.response?.data?.message)

          return
        }

        toast.success(res.payload.message)
        handleClose()
      })
      .finally(() => setIsLoading(true))
  })

  const handleGetAllRole = async () => {
    setIsLoadRole(true)

    const body: any = {
      params: {
        page: 1,
        rows: 1000
      }
    }

    // @ts-ignore
    await dispatch(getAllRole({ data: body }))
      .then(res => {
        if (res?.meta.requestStatus !== 'fulfilled') {
          return
        }

        setRoles(res?.payload?.content?.entries)
      })
      .finally(() => setIsLoadRole(false))
  }

  useEffect(() => {
    handleGetAllRole()
  }, [])

  return (
    <Dialog ref={dialogRef} title='Tambah Pengguna Baru' onSubmit={onSubmit} isLoading={isLoading}>
      <Grid container spacing={4}>
        <Grid item xs={12} sx={{ paddingBottom: '8px' }}>
          <Controller
            control={control}
            name='name'
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label='Nama'
                placeholder='Masukan Nama User'
                error={!!error}
                helperText={error?.message}
              />
            )}
            rules={{
              required: 'Nama harus diisi'
            }}
          />
        </Grid>

        <Grid item xs={12} sx={{ paddingBottom: '8px' }}>
          <Controller
            control={control}
            name='email'
            render={({ field, fieldState: { error } }) => (
              <>
                <InputMask {...field} type='email' label={'Email'} placeholder={'Email'} fullWidth />
                {error && <FormHelperText error>{error.message}</FormHelperText>}
              </>
            )}
            rules={{
              required: 'Email harus diisi',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email tidak valid'
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='roleId'
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                options={roles}
                loading={isLoadRole}
                getOptionLabel={(option: any) => option?.name}
                filterSelectedOptions
                renderInput={params => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Role Assignment'
                    placeholder='Pilih Role Akses'
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
                value={roles?.find((role: any) => role?.id === field.value) ?? null}
                onChange={(e, v: any) => field.onChange(v?.id)}
              />
            )}
            rules={{
              required: 'Role harus diisi'
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name='password'
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label='Password'
                placeholder='Masukan Password'
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        aria-label='toggle password visibility'
                      >
                        {isShowPassword ? <Icon icon='mdi:eye-outline' /> : <Icon icon='mdi:eye-off-outline' />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
            rules={{
              required: 'Password harus diisi'
            }}
          />
        </Grid>
      </Grid>
    </Dialog>
  )
})

DialogAdd.displayName = 'DialogAdd'

export default DialogAdd
