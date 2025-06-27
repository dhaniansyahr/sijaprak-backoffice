import { GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import { checkFreeJadwal } from 'src/stores/jadwal/action'
import { useAppDispatch } from 'src/utils/dispatch'

export const useGetFreeJadwal = () => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const handleGetFreeJadwal = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(checkFreeJadwal({ data: {} })).then(res => {
      if (res.meta.requestStatus) {
        setIsLoading(false)

        return
      }

      setIsLoading(false)
      setData(res.payload.content)
    })
  }

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
    {
      flex: 0.25,
      field: 'shift',
      headerName: 'Shift',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.shift ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'startTime',
      headerName: 'Start Time',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.startTime ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'endTime',
      headerName: 'End Time',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.endTime ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'ruangan',
      headerName: 'Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params?.row?.ruangan ?? '-'}</span>
      }
    }

    // {
    //   flex: 0.25,
    //   field: 'action',
    //   headerName: 'Aksi',
    //   minWidth: 160,
    //   sortable: false,
    //   renderCell: (params: any) => {
    //     return (
    //       <Box>
    //         <Button variant='contained' size='small'>
    //           Pilih
    //         </Button>
    //       </Box>
    //     )
    //   }
    // }
  ]

  return {
    isLoading,
    data,
    columns,
    handleGetFreeJadwal
  }
}
