import { Icon } from '@iconify/react'
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
import { useState } from 'react'
import { RootState } from 'src/stores'
import { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'
import { TRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useGetAllRuanganLaboratorium } from '../../hooks/useRuanganLaboratorium'

// Dialogs
import DialogCreateRuanganLaboratorium from '../dialogs/DialogCreate'
import DialogDetailRuanganLaboratorium from '../dialogs/DialogDetail'
import DialogEditRuanganLaboratorium from '../dialogs/DialogEdit'
import DialogAssignKepalaLab from '../dialogs/DialogAssignKepalaLab'

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default function LaboratoriumTable() {
  const { isRefresh } = useAppSelector(state => state.ruanganLaboratorium)

  const { data, isLoading, page, pageSize, setPage, setPageSize, handleSearch } =
    useGetAllRuanganLaboratorium(isRefresh)

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
                size='small'
                placeholder='Cari Nama'
                onChange={(e: any) => handleSearch(e.target.value)}
                sx={{ minWidth: 200 }}
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
            loading={isLoading}
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

      <DialogCreateRuanganLaboratorium open={isCreateDialogOpen} onClose={(v: boolean) => setIsCreateDialogOpen(v)} />

      <DialogEditRuanganLaboratorium
        open={isEditDialogOpen}
        onClose={(v: boolean) => setIsEditDialogOpen(v)}
        values={itemSelected}
      />

      <DialogDetailRuanganLaboratorium
        open={isDetailDialogOpen}
        onClose={(v: boolean) => setIsDetailDialogOpen(v)}
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
