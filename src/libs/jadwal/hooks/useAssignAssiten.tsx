import { Button } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { IDialogRef } from 'src/components/shared/dialog'
import Can, { AbilityContext } from 'src/layouts/components/acl/Can'
import { assignAsistenLab, getAsistenLabByJadwalId } from 'src/stores/asisten-lab/action'
import { setIsRefresh } from 'src/stores/jadwal/slice'
import { useAppDispatch } from 'src/utils/dispatch'

export function useAssignAsisten(id: string, dialogRef: React.RefObject<IDialogRef>) {
  const dispatch = useAppDispatch()
  const ability = useContext(AbilityContext)

  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isActionAllowed = useMemo(() => {
    return ability?.can('assign', 'JADWAL')
  }, [ability])

  const handleAssign = useCallback(
    async (assignId: string) => {
      toast.loading('Loading...')

      // @ts-ignore
      await dispatch(assignAsistenLab({ id: assignId })).then(res => {
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
    },
    [dispatch, dialogRef]
  )

  const columns: GridColDef[] = useMemo(() => {
    const baseColumns = [
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
      }
    ]

    if (isActionAllowed) {
      baseColumns.push({
        flex: 0.25,
        field: 'action',
        headerName: 'Aksi',
        minWidth: 160,
        sortable: false,
        renderCell: (params: any) => {
          return (
            <Can I={'assign'} a={'JADWAL'}>
              <Button variant='contained' size='small' onClick={() => handleAssign(params?.row?.id)}>
                Assign
              </Button>
            </Can>
          )
        }
      })
    }

    return baseColumns
  }, [isActionAllowed, handleAssign])

  const handleGetData = useCallback(async () => {
    if (!id) return

    setIsLoading(true)

    try {
      // @ts-ignore
      const res = await dispatch(getAsistenLabByJadwalId({ id }))
      if (res?.meta?.requestStatus !== 'fulfilled') {
        setIsLoading(false)

        return
      }

      setIsLoading(false)
      setData(res?.payload?.content)
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error)
    }
  }, [dispatch, id])

  useEffect(() => {
    handleGetData()
  }, [handleGetData])

  return {
    data,
    columns,
    isLoading
  }
}
