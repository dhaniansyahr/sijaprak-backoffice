// React Imports
import { useState } from 'react'

// MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid'

// Third Party Imports
import { Icon } from '@iconify/react'

// Hooks & types
import { TRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useAppSelector } from 'src/utils/dispatch'

// Dialogs
import DialogCreateRuanganLaboratorium from '../dialogs/DialogCreate'
import DialogDetailRuanganLaboratorium from '../dialogs/DialogDetail'
import DialogEditRuanganLaboratorium from '../dialogs/DialogEdit'
import DialogAssignKepalaLab from '../dialogs/DialogAssignKepalaLab'
import { useGetAllRuangan } from 'src/stores/laboratorium/service'

export default function LaboratoriumTable() {
  const { isRefresh } = useAppSelector(state => state.ruanganLaboratorium)

  const { data, isLoadTable, page, pageSize, setPage, setPageSize, handleSearch } = useGetAllRuangan(isRefresh)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false)
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState<boolean>(false)
  const [itemSelected, setItemSelected] = useState<any>(null)

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
                setIsDetailDialogOpen(true)
                setItemSelected(params.row)
              }}
            >
              <Icon icon='ph:eye' />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsEditDialogOpen(true)
                setItemSelected(params.row)
              }}
            >
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsChangeDialogOpen(true)
                setItemSelected(params.row)
              }}
            >
              <Icon icon='ic:round-change-circle' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 500 }}>
                Manajemen Laboratorium
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
          title={
            <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
              <TextField
                fullWidth
                size='small'
                placeholder='Cari Nama'
                onChange={(e: any) => handleSearch(e.target.value)}
                sx={{ minWidth: 200, pr: 2 }}
              />
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button variant='contained' color='primary' sx={{ mb: 2 }} onClick={() => setIsCreateDialogOpen(true)}>
                Tambah Laboratorium
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
          <DataGrid<TRuanganLaboratorium>
            autoHeight
            rows={data?.entries ?? []}
            columns={columns}
            pagination
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            rowCount={data?.totalData ?? 0}
            paginationModel={{
              page: page - 1,
              pageSize: pageSize
            }}
            onPaginationModelChange={(newModel: any) => {
              setPage(newModel.page + 1)
              setPageSize(newModel.pageSize)
            }}
            loading={isLoadTable}
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

      <DialogCreateRuanganLaboratorium open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />

      <DialogEditRuanganLaboratorium
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        values={itemSelected}
      />

      <DialogDetailRuanganLaboratorium
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        values={itemSelected}
      />

      <DialogAssignKepalaLab
        open={isChangeDialogOpen}
        onClose={(v: boolean) => setIsChangeDialogOpen(v)}
        values={itemSelected}
      />
    </>
  )
}
