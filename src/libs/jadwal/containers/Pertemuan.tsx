import { Box, Card, CardContent } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import HeaderPage from 'src/components/shared/header-page'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/utils/dispatch'
import { getAllMeetings } from 'src/stores/jadwal/action'
import DataTable from 'src/components/shared/table'

export default function PertemuanContainer() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { id } = router.query as { id: string }

  const [state, setState] = useState<{
    isLoading: boolean
    data: any
  }>({
    isLoading: false,
    data: null
  })

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 80,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },

    // {
    //   flex: 0.25,
    //   field: 'mataKuliah',
    //   headerName: 'Mata Kuliah',
    //   sortable: false,
    //   renderCell: (params: any) => {
    //     return <span>{params?.row?.jadwal?.matakuliah?.nama ?? '-'}</span>
    //   }
    // },
    {
      flex: 0.25,
      field: 'tanggal',
      headerName: 'Tanggal Pertemuan',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'hari',
      headerName: 'Hari',
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.jadwal?.hari || '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'waktu',
      headerName: 'Waktu Pertemuan',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <span>
            {params?.row?.jadwal?.shift?.startTime ?? '-'} - {params?.row?.jadwal?.shift?.endTime ?? '-'}
          </span>
        )
      }
    },
    {
      flex: 0.25,
      field: 'ruangan',
      headerName: 'Ruangan',
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.jadwal?.ruangan?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'dosen',
      headerName: 'Dosen Pengampu',
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {params?.row?.jadwal?.dosen?.map((dosen: any) => (
              <span key={dosen?.id}>
                {dosen?.nama ?? '-'} ({dosen?.nip ?? '-'})
              </span>
            ))}
          </Box>
        )
      }
    }
  ]

  const handleGetData = async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    const body: any = {
      params: {
        page: 1,
        rows: 10000
      }
    }

    // @ts-ignore
    await dispatch(getAllMeetings({ jadwalId: id, data: body })).then((res: any) => {
      if (res.meta.requestStatus !== 'fulfilled') {
        return
      }

      setState(prev => ({ ...prev, data: res.payload.content }))
    })

    setState(prev => ({ ...prev, isLoading: false }))
  }

  useEffect(() => {
    handleGetData()
  }, [id])

  const onPaginationModelChange = (newModel: any) => {
    setState(prev => ({ ...prev, page: newModel.page + 1, pageSize: newModel.pageSize }))
  }

  return (
    <Card sx={{ padding: '16px' }}>
      <HeaderPage
        icon='meteor-icons:arrow-left'
        title={'Detail Pertemuan - ' + state?.data?.entries?.[0]?.jadwal?.matakuliah?.nama}
      />

      <CardContent sx={{ padding: '24px !important' }}>
        <DataTable
          data={state?.data}
          columns={columns}
          page={1}
          pageSize={20}
          hideFooter={true}
          hideFooterPagination={true}
          isLoading={state?.isLoading}
          onPaginationModelChange={onPaginationModelChange}
        />
      </CardContent>
    </Card>
  )
}
