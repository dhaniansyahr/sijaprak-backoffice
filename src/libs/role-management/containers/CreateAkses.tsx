import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { NextRouter, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function CreateAkses() {
  const router: NextRouter = useRouter()

  const [body, setBody] = useState<any>({ userLevelId: '', acl: [] })
  const [name, setName] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [level, setLevel] = useState<any>(null)
  const [features, setFeatures] = useState<any>(null)

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
            {params?.row?.action?.map((item: any, index: number) => (
              <FormControlLabel
                key={index}
                control={<Checkbox />}
                label={item.name}
                onClick={() => {
                  const acl = [...body.acl]
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

                  setBody({ ...body, acl })
                }}
              />
            ))}
          </div>
        )
      }
    }
  ]

  //   const handleGetAllLevels = async () => {
  //     setIsLoading(true)

  //     const body: any = {
  //       params: {
  //         page: 1,
  //         rows: 1000
  //       }
  //     }

  //     // @ts-ignore
  //     await dispatch(getAllUserLevel({ data: body })).then((res: any) => {
  //       if (res?.meta?.requestStatus !== 'fulfilled') {
  //         toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)
  //         setIsLoading(false)
  //         setLevel(null)

  //         return
  //       }

  //       setIsLoading(false)
  //       setLevel(res?.payload?.content?.entries)
  //     })
  //   }

  //   const handleGetAllFeatures = async () => {
  //     setIsLoading(true)

  //     // @ts-ignore
  //     await dispatch(getAllFeauture({ data: {} })).then((res: any) => {
  //       if (res?.meta?.requestStatus !== 'fulfilled') {
  //         toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)
  //         setIsLoading(false)
  //         setFeatures(null)

  //         return
  //       }

  //       setIsLoading(false)
  //       setFeatures(res?.payload?.content)
  //     })
  //   }

  //   const handleCreate = async () => {
  //     setIsLoading(true)
  //     toast.loading('Loading...')

  //     // @ts-ignore
  //     const levelId = await dispatch(createUserLevel({ data: { name } })).then((res: any) => {
  //       if (res?.meta?.requestStatus !== 'fulfilled') {
  //         toast.dismiss()
  //         toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)
  //         setIsLoading(false)

  //         return
  //       }

  //       return res?.payload?.content?.id
  //     })

  //     if (levelId) {
  //       const bodyAcl: any = {
  //         ...body,
  //         userLevelId: levelId
  //       }

  //       // @ts-ignore
  //       await dispatch(createAcl({ data: bodyAcl })).then((res: any) => {
  //         setIsLoading(false)
  //         toast.dismiss()
  //         if (res?.meta?.requestStatus !== 'fulfilled') {
  //           toast.error(res?.payload?.response?.data?.errors?.[0]?.message ?? res?.payload?.response?.data?.message)

  //           return
  //         }

  //         toast.success(res?.payload?.message)
  //         router.push('/admin/acl')
  //       })
  //     }
  //   }

  //   useEffect(() => {
  //     handleGetAllLevels()
  //     handleGetAllFeatures()
  //   }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box display={'flex'} gap={2} alignItems={'center'}>
                <IconButton onClick={() => router.back()}>
                  <Icon icon='ic:baseline-arrow-back' />
                </IconButton>

                <Typography variant='h6' sx={{ fontWeight: 500 }}>
                  Tambah Akses
                </Typography>
              </Box>
            }
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'start', md: 'center' },
              borderBottom: '1px solid #f4f4f4'
            }}
          />

          <CardHeader
            action={
              <Box display={'flex'} gap={2} alignItems={'center'}>
                <Button variant='contained' color='secondary' onClick={() => router.push('/admin/acl')}>
                  Batal
                </Button>
                <Button variant='contained' color='primary'>
                  Simpan
                </Button>
              </Box>
            }
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'start', md: 'center' },
              borderBottom: '1px solid #f4f4f4'
            }}
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
        </Card>
      </Grid>
    </Grid>
  )
}
