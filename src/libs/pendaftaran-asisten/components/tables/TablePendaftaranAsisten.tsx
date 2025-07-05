import { Box, Card, CardContent, CardHeader, CircularProgress, TextField } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useTable } from './useTable'
import HeaderPage from 'src/components/shared/header-page'
import DialogPendaftaran from '../dialogs/DialogPendaftaran'

export default function TablePendaftaranAsisten() {
  const { columns, tableState, setTableState, handleSearch, dialogPendaftaranRef, row } = useTable()

  return (
    <Card>
      <HeaderPage title='Pendaftaran Asisten Laboratorium' />

      <CardHeader
        title={
          <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              size='small'
              placeholder='Cari Nama'
              onChange={(e: any) => handleSearch(e.target.value)}
              sx={{ minWidth: 200 }}
              fullWidth
            />
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
        <DataGrid
          autoHeight
          getRowHeight={() => 'auto'}
          rows={tableState.data?.entries ?? []}
          columns={columns}
          pagination
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          rowCount={tableState.data?.totalData ?? 0}
          paginationModel={{
            page: tableState.page - 1,
            pageSize: tableState.pageSize
          }}
          onPaginationModelChange={(newModel: any) => {
            setTableState(prev => ({ ...prev, page: newModel.page + 1, pageSize: newModel.pageSize }))
          }}
          loading={tableState.isLoading}
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

      <DialogPendaftaran dialogRef={dialogPendaftaranRef} jadwalId={row?.id} />
    </Card>
  )
}
