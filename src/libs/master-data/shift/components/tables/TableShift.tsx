import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material'
import { memo } from 'react'
import { Icon } from '@iconify/react'
import { useShiftTable } from '../../hooks/useShitTable'
import HeaderPage from 'src/components/shared/header-page'
import DialogAdd from '../dialogs/DialogAdd'
import DataTable from 'src/components/shared/table'

const TableShift = () => {
  // Hooks Table
  const { columns, isAddDialogOpen, setIsAddDialogOpen, tableState, handleSearch, setTableState } = useShiftTable()

  const onPaginationModelChange = (newModel: any) => {
    setTableState(prev => ({ ...prev, page: newModel.page + 1, pageSize: newModel.pageSize }))
  }

  return (
    <Card elevation={4}>
      <HeaderPage title='Management Shift' />

      <CardHeader
        title={
          <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari waktu mulai dan waktu berakhir'
              onChange={e => handleSearch(e.target.value)}
              sx={{ minWidth: 200, pr: 2 }}
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setIsAddDialogOpen(true)}
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

      <CardContent>
        <DataTable
          data={tableState.data}
          columns={columns}
          page={tableState.page}
          pageSize={tableState.pageSize}
          isLoading={tableState.isLoading}
          onPaginationModelChange={onPaginationModelChange}
        />
      </CardContent>

      <DialogAdd open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </Card>
  )
}

export default memo(TableShift)
