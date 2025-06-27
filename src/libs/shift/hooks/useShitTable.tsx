import { Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useState, useCallback, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'
import { updateShift } from 'src/stores/shift/action'
import { setIsRefresh } from 'src/stores/shift/slice'
import { TShift } from 'src/stores/shift/types'
import { useAppDispatch } from 'src/utils/dispatch'

// Custom debounce hook for search optimization
const useDebounce = (callback: (value: string) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>()

  return useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(value)
      }, delay)
    },
    [callback, delay]
  )
}

export const useShiftTable = (searchHandler?: (value: string) => void) => {
  const dispatch = useAppDispatch()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Debounced search with 300ms delay
  const debouncedSearch = useDebounce(searchHandler || (() => {}), 300)

  const handleToggle = useCallback(
    async (isActive: boolean, row: TShift) => {
      setIsLoading(true)

      const body = {
        startTime: row.startTime,
        endTime: row.endTime,
        isActive
      }

      try {
        // @ts-ignore
        const res = await dispatch(updateShift({ data: body, id: row.id }))

        if (res?.meta.requestStatus !== 'fulfilled') {
          toast.error(res.payload.response?.data?.errors?.[0]?.message || res.payload?.response?.data?.message)

          return
        }

        toast.success(res.payload.message)
        dispatch(setIsRefresh())
      } catch (error) {
        toast.error('Failed to update shift status')
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch]
  )

  const columns: GridColDef<TShift>[] = useMemo(
    () => [
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
              disabled={isLoading}
            />
          )
        }
      }
    ],
    [handleToggle, isLoading]
  )

  const handleOpenDialog = useCallback(() => {
    setIsAddDialogOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setIsAddDialogOpen(false)
  }, [])

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    debouncedSearch,
    columns,
    isLoading
  }
}
