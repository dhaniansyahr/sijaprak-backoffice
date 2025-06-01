import { Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { updateShift } from 'src/stores/shift/action'
import { setIsRefresh } from 'src/stores/shift/slice'
import { TShift } from 'src/stores/shift/types'
import { useAppDispatch } from 'src/utils/dispatch'

export const useShiftTable = () => {
  const dispatch = useAppDispatch()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleToggle = async (isActive: boolean, row: TShift) => {
    setIsLoading(true)

    const body = {
      startTime: row.startTime,
      endTime: row.endTime,
      isActive
    }

    // @ts-ignore
    await dispatch(updateShift({ data: body, id: row.id })).then(res => {
      if (res?.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)
        toast.error(res.payload.response?.data?.errors?.[0]?.message || res.payload?.response?.data?.message)

        return
      }

      toast.success(res.payload.message)
      setIsLoading(false)
      dispatch(setIsRefresh())
    })
  }

  const columns: GridColDef<TShift>[] = [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 80,
      sortable: false,
      renderCell: params => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'startTime',
      headerName: 'Start Time',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params?.row?.startTime}</span>
      }
    },
    {
      flex: 0.25,
      field: 'endTime',
      headerName: 'End Time',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params?.row?.endTime}</span>
      }
    },
    {
      flex: 0.25,
      field: 'isActive',
      headerName: 'Is Active',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return (
          <Switch
            checked={params.row.isActive}
            color='success'
            onChange={e => handleToggle(e.target.checked, params?.row)}
          />
        )
      }
    }
  ]

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    columns,
    isLoading
  }
}
