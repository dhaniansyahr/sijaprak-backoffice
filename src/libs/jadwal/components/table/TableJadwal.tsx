import { Box, Button, Card, CardContent, CardHeader, CircularProgress, TextField } from '@mui/material'
import { memo } from 'react'
import { Icon } from '@iconify/react'
import HeaderPage from 'src/components/shared/header-page'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useTable } from '../../hooks/useTable'
import DataTable from 'src/components/shared/table'
import DialogAssignAsistenLab from '../dialogs/DialogAssignAsistenLab'
import Can from 'src/layouts/components/acl/Can'

const TableJadwal = () => {
  const router = useRouter()

  // Hooks Table
  const { columns, tableState, handleSearch, setTableState, handleGenerate, isGenerating, assignAsistenLabRef, row } =
    useTable()

  const onPaginationModelChange = (newModel: any) => {
    setTableState(prev => ({ ...prev, page: newModel.page + 1, pageSize: newModel.pageSize }))
  }

  return (
    <Card elevation={4}>
      <HeaderPage title='Management Jadwal' />

      <CardHeader
        title={
          <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari Jadwal'
              onChange={e => handleSearch(e.target.value)}
              sx={{ minWidth: 200, pr: 2 }}
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Can I={'generate'} a={'JADWAL'}>
              <LoadingButton
                variant='outlined'
                color='primary'
                loading={isGenerating}
                loadingIndicator={<CircularProgress size={20} />}
                onClick={handleGenerate}
                startIcon={<Icon icon='mdi:refresh' />}
              >
                Generate
              </LoadingButton>
            </Can>

            <Can I={'create'} a={'JADWAL'}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => router.push('/jadwal/create')}
                startIcon={<Icon icon='ic:baseline-add' />}
              >
                Tambah
              </Button>
            </Can>
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

      <DialogAssignAsistenLab dialogRef={assignAsistenLabRef} id={row?.id} />
    </Card>
  )
}

export default memo(TableJadwal)
