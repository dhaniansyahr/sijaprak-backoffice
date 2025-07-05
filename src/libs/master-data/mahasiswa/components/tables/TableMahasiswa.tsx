// React Imports
import { Box, Card, CardContent, CardHeader, TextField } from '@mui/material'
import { lazy, Suspense, memo } from 'react'

// Hooks & types
import HeaderPage from 'src/components/shared/header-page'
import DataTable from 'src/components/shared/table'
import { useTable } from './useTable'

// Lazy load dialogs to reduce initial bundle size
const DialogDetailRuanganLaboratorium = lazy(() => import('../dialogs/DialogDetail'))

// Minimal loading fallback
const DialogLoader = () => null

const TableMahasiswa = memo(() => {
  // Hooks
  const { columns, state, setState, tableState, setTableState, handleSearch } = useTable()

  const onPaginationModelChange = (newModel: any) => {
    setTableState(prev => ({ ...prev, page: newModel.page + 1, pageSize: newModel.pageSize }))
  }

  const handleCloseDialog = (dialogType: keyof typeof state) => {
    setState(prev => ({ ...prev, [dialogType]: false }))
  }

  return (
    <>
      <Card>
        <HeaderPage title='Manajemen Mahasiswa' />

        <CardHeader
          title={
            <Box display='flex' flexWrap='wrap' gap={1.5} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
              <TextField
                fullWidth
                size='small'
                placeholder='Cari Nama atau NPM Mahasiswa'
                onChange={e => handleSearch(e.target.value)}
                sx={{ minWidth: 200, pr: 2 }}
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
      </Card>

      <Suspense fallback={<DialogLoader />}>
        {state.isDetail && (
          <DialogDetailRuanganLaboratorium
            open={state.isDetail}
            onClose={() => handleCloseDialog('isDetail')}
            values={state.rowSelected}
          />
        )}
      </Suspense>
    </>
  )
})

TableMahasiswa.displayName = 'TableMahasiswa'

export default TableMahasiswa
