import { Icon } from '@iconify/react'
import { Box, IconButton, Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import { TRuanganLaboratorium } from 'src/stores/laboratorium/types'

export const useRuanganTable = () => {
  // State
  const [isDialogAddOpen, setIsDialogAddOpen] = useState<boolean>(false)
  const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false)
  const [isDialogDetailOpen, setIsDialogDetailOpen] = useState<boolean>(false)
  const [isDialogChangeOpen, setIsDialogChangeOpen] = useState<boolean>(false)
  const [rowSelected, setRowSelected] = useState<TRuanganLaboratorium | null>(null)

  const columns: GridColDef<TRuanganLaboratorium>[] = [
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
      field: 'nama',
      headerName: 'Nama Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params.row.nama || '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'kepala',
      headerName: 'Kepala Lab',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params.row.namaKepalaLab || '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nip',
      headerName: 'NIP',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params.row.nipKepalaLab || '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'letak',
      headerName: 'Lokasi Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params.row.lokasi || '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'isActive',
      headerName: 'Is Active',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <Switch checked={false} color='success' />
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'ACTION',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={() => {
                setIsDialogDetailOpen(true)
                setRowSelected(params.row)
              }}
            >
              <Icon icon='ph:eye' />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsDialogEditOpen(true)
                setRowSelected(params.row)
              }}
            >
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsDialogChangeOpen(true)
                setRowSelected(params.row)
              }}
            >
              <Icon icon='ic:round-change-circle' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return {
    isDialogAddOpen,
    setIsDialogAddOpen,
    isDialogEditOpen,
    setIsDialogEditOpen,
    isDialogDetailOpen,
    setIsDialogDetailOpen,
    isDialogChangeOpen,
    setIsDialogChangeOpen,
    rowSelected,
    columns
  }
}
