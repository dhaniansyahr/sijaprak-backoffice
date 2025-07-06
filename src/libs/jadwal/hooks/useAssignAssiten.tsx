import { Button } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { DialogRef } from 'src/components/shared/dialog'
import { assignAsistenLab, getAsistenLabByJadwalId } from 'src/stores/asisten-lab/action'
import { setIsRefresh } from 'src/stores/jadwal/slice'
import { useAppDispatch } from 'src/utils/dispatch'

export function useAssignAsisten(id: string, dialogRef: React.RefObject<DialogRef>) {
  const dispatch = useAppDispatch()

  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const columns: GridColDef[] = useMemo(() => {
    return [
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
        field: 'name',
        headerName: 'Nama Mahasiswa',
        minWidth: 160,
        sortable: false,
        renderCell: (params: any) => {
          return <span>{params?.row?.mahasiswa?.nama ?? '-'}</span>
        }
      },
      {
        flex: 0.25,
        field: 'npm',
        headerName: 'NPM',
        minWidth: 160,
        sortable: false,
        renderCell: (params: any) => {
          return <span>{params?.row?.mahasiswa?.npm ?? '-'}</span>
        }
      },
      {
        flex: 0.25,
        field: 'semester',
        headerName: 'Semester',
        minWidth: 160,
        sortable: false,
        renderCell: (params: any) => {
          return <span>{params?.row?.mahasiswa?.semester ?? '-'}</span>
        }
      },
      {
        flex: 0.25,
        field: 'action',
        headerName: 'Aksi',
        minWidth: 160,
        sortable: false,
        renderCell: (params: any) => {
          return (
            <Button variant='contained' size='small' onClick={() => handleAssign(params?.row?.id)}>
              Assign
            </Button>
          )
        }
      }
    ]
  }, [])

  const handleGetData = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(getAsistenLabByJadwalId({ data: {}, id })).then(res => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        return
      }

      setIsLoading(false)
      setData(res?.payload?.content)
    })
  }

  const handleAssign = async (id: string) => {
    toast.loading('Loading...')

    // @ts-ignore
    await dispatch(assignAsistenLab({ id })).then(res => {
      if (res?.meta?.requestStatus !== 'fulfilled') {
        toast.dismiss()
        toast.error(res?.payload?.response?.data?.message)

        return
      }

      toast.dismiss()
      toast.success(res?.payload?.message)
      dispatch(setIsRefresh())
      dialogRef?.current?.close()
    })
  }

  useEffect(() => {
    handleGetData()
  }, [id])

  return {
    data,
    columns,
    isLoading
  }
}
