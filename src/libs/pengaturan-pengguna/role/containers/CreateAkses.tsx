import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import HeaderPage from 'src/components/shared/header-page'
import { getAllFeauture, updateRole } from 'src/stores/role/action'
import { useAppDispatch } from 'src/utils/dispatch'

export default function CreateAkses() {
  const router: NextRouter = useRouter()
  const dispatch = useAppDispatch()

  const form = useForm()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [features, setFeatures] = useState<any>(null)

  const isActionChecked = (featureName: string, actionName: string) => {
    const acl = form.getValues('acl') || []
    const feature = acl.find((f: any) => f.featureName === featureName)

    return feature ? feature.actions.includes(actionName) : false
  }

  const columns = [
    {
      flex: 0.25,
      field: 'no',
      headerName: '',
      maxWidth: 50,
      renderCell: (params: any) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nama',
      headerName: 'List Feature',
      minWidth: 160,
      renderCell: (params: any) => {
        return <span>{params?.row?.name.replaceAll('_', ' ') ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'ACTION',
      minWidth: 160,
      renderCell: (params: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: 2
            }}
          >
            {params?.row?.actions?.map((item: any, index: number) => (
              <FormControlLabel
                key={index}
                control={<Checkbox checked={isActionChecked(params.row.name, item.name)} />}
                label={
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {item.name}
                  </Typography>
                }
                onClick={() => {
                  const acl = [...form.getValues('acl')]
                  const featureIndex = acl.findIndex(f => f.featureName === params.row.name)

                  if (featureIndex === -1) {
                    acl.push({
                      featureName: params.row.name,
                      actions: [item.name]
                    })
                  } else {
                    const feature = acl[featureIndex]
                    const actionIndex = feature.actions.indexOf(item.name)

                    if (actionIndex === -1) {
                      feature.actions.push(item.name)
                    } else {
                      feature.actions.splice(actionIndex, 1)
                    }

                    // Remove feature if no actions left
                    if (feature.actions.length === 0) {
                      acl.splice(featureIndex, 1)
                    }
                  }

                  form.setValue('acl', acl)
                }}
              />
            ))}
          </div>
        )
      }
    }
  ]

  const handleGetAllFeatures = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getAllFeauture({ data: {} })).then((res: any) => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)
        setIsLoading(false)
        setFeatures(null)

        return
      }

      setIsLoading(false)
      setFeatures(res?.payload?.content)
    })
  }

  const formatUpdateBody = () => {
    const formData = form.getValues()
    const acl = formData.acl || []

    return {
      namaRole: '',
      permissions: acl.map((item: any) => ({
        subject: item.featureName,
        action: item.actions
      }))
    }
  }

  const onSubmit = form.handleSubmit(async () => {
    setIsLoading(true)
    toast.loading('Loading...')

    const updateData = formatUpdateBody()

    // @ts-ignore
    await dispatch(updateRole({ data: updateData })).then((res: any) => {
      setIsLoading(false)
      toast.dismiss()

      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

        return
      }

      toast.success(res?.payload?.message)
      router.back()
    })
  })

  useEffect(() => {
    handleGetAllFeatures()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <form action='' onSubmit={onSubmit}>
            <HeaderPage
              title='Tambah Role Baru'
              icon='mdi:arrow-left'
              action={
                <Box display={'flex'} gap={2} alignItems={'center'}>
                  <Button variant='contained' color='secondary' onClick={() => router.back()}>
                    Batal
                  </Button>
                  <Button variant='contained' color='primary' type='submit'>
                    Simpan
                  </Button>
                </Box>
              }
            />

            <CardContent style={{ paddingInline: '10px' }}>
              <DataGrid
                autoHeight
                rows={features ?? []}
                columns={columns}
                rowCount={features?.length ?? 0}
                loading={isLoading}
                hideFooter
                slots={{
                  loadingOverlay: CircularProgress
                }}
                sx={{
                  [`& .${gridClasses.cell}`]: {
                    py: 1
                  }
                }}
              />
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}
