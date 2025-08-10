// React Import
import React, { useState, memo, useCallback, useEffect } from 'react'

// Third Party
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// Services & Types
import { useAppDispatch } from 'src/utils/dispatch'

// Redux Imports
import { setIsRefresh } from 'src/stores/users/slice'

// Components
import Dialog, { IDialogRef } from 'src/components/shared/dialog'
import { Autocomplete, FormHelperText, Grid, TextField } from '@mui/material'
import { InputMask } from 'src/components/shared/input/InputMask'
import { getAllRole } from 'src/stores/role/action'
import { getUser, updateUser } from 'src/stores/users/action'

interface IDialogEditProps {
  dialogRef: React.RefObject<IDialogRef>
  id: string
}

const DialogEdit = memo(({ dialogRef, id }: IDialogEditProps) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const [roles, setRoles] = useState<any[]>([])
  const [isLoadRole, setIsLoadRole] = useState(false)

  const { control, reset, handleSubmit, setError, setValue } = useForm<any>()

  const handleClose = useCallback(() => {
    reset()

    dialogRef.current?.close()
    dispatch(setIsRefresh())
  }, [reset, dialogRef, dispatch])

  const onSubmit = handleSubmit(async value => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(updateUser({ data: value, id }))
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

  const handleGetDetail = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getUser({ id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        return
      }

      const content = res?.payload?.content

      setIsLoading(false)
      setValue('fullName', content?.fullName)
      setValue('email', content?.email)
      setValue('userLevelId', content?.userLevelId)
    })
  }

  useEffect(() => {
    handleGetAllRole()
    handleGetDetail()
  }, [])

  return (
    <Dialog ref={dialogRef} title='Edit Pengguna' onSubmit={onSubmit} isLoading={isLoading}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='fullName'
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label='Nama Lengkap'
                placeholder='Masukan Nama Lengkap'
                error={!!error}
                helperText={error?.message}
              />
            )}
            rules={{
              required: 'Nama harus diisi'
            }}
          />
        </Grid>

        <Grid item xs={12}>
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
            name='userLevelId'
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
      </Grid>
    </Dialog>
  )
})

export default DialogEdit
