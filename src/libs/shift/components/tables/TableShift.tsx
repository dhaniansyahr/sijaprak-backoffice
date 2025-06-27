import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material'
import { Fragment, memo } from 'react'
import { Icon } from '@iconify/react'
import { TShift } from 'src/stores/shift/types'
import { useShiftTable } from '../../hooks/useShitTable'
import DefaultTable from 'src/components/shared/table'
import HeaderPage from 'src/components/shared/header-page'
import DialogAdd from '../dialogs/DialogAdd'

const TableShift = () => {
  // Hooks Table
  const { columns, isAddDialogOpen, setIsAddDialogOpen, tableState, handleSearch, setTableState } = useShiftTable()

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
        <DefaultTable<TShift>
          entries={tableState.data?.entries ?? []}
          columns={columns}
          totalData={tableState.data?.totalData ?? 0}
          page={tableState.page}
          pageSize={tableState.pageSize}
          setPage={page => setTableState(prev => ({ ...prev, page }))}
          setPageSize={pageSize => setTableState(prev => ({ ...prev, pageSize }))}
          isLoading={tableState.isLoading}
        />
      </CardContent>

      <DialogAdd open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </Card>
  )
}

export default memo(TableShift)
