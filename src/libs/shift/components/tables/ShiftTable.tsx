import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid'
import { Fragment, useState } from 'react'
import CreateShiftDialog from '../dialogs/CreateShiftDialog'
import { Icon } from '@iconify/react'
import { TShift } from 'src/stores/shift/types'
import { useAppSelector } from 'src/utils/dispatch'
import { useGetAllShifts } from 'src/stores/shift/service'

export default function ShiftTable() {
  const { isRefresh } = useAppSelector(state => state.shift)

  const { data, isLoadTable, page, setPage, pageSize, setPageSize, handleSearch } = useGetAllShifts(isRefresh)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)

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
        return <Switch checked={params.row.isActive} color='success' />
      }
    }
  ]

  return (
    <Fragment>
      <Card elevation={4}>
        <CardHeader
          title={
            <Box>
              <Typography variant='h4' fontWeight={500}>
                Manajemen Shift
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
                placeholder='Cari waktu mulai dan waktu berakhir'
                onChange={(e: any) => handleSearch(e.target.value)}
                sx={{ minWidth: 200, pr: 2 }}
              />
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => setIsCreateDialogOpen(true)}
                startIcon={<Icon icon='ic:baseline-add' />}
              >
                Tambah Shift
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
          <DataGrid<TShift>
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

      <CreateShiftDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </Fragment>
  )
}
