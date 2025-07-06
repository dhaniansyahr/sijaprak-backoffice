// React Imports
import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material'
import { lazy, Suspense, memo } from 'react'

// Hooks & types
import HeaderPage from 'src/components/shared/header-page'
import { useRuanganTable } from '../../hook/useRuanganTable'
import DataTable from 'src/components/shared/table'
import { AddIcon } from 'src/components/shared/icons'

// Lazy load dialogs to reduce initial bundle size
const DialogCreateRuanganLaboratorium = lazy(() => import('../dialogs/DialogCreate'))
const DialogDetailRuanganLaboratorium = lazy(() => import('../dialogs/DialogDetail'))
const DialogEditRuanganLaboratorium = lazy(() => import('../dialogs/DialogEdit'))
const DialogAssignKepalaLab = lazy(() => import('../dialogs/DialogAssignKepalaLab'))

// Minimal loading fallback
const DialogLoader = () => null

const TableRuangan = memo(() => {
  // Hooks
  const { columns, state, setState, tableState, setTableState, handleSearch } = useRuanganTable()

  const onPaginationModelChange = (newModel: any) => {
    setTableState(prev => ({ ...prev, page: newModel.page + 1, pageSize: newModel.pageSize }))
  }

  const handleCloseDialog = (dialogType: keyof typeof state) => {
    setState(prev => ({ ...prev, [dialogType]: false }))
  }

  return (
    <>
      <Card>
        <HeaderPage title='Manajemen Ruangan Laboratorium' />

        <CardHeader
          title={
            <Box display='flex' flexWrap='wrap' gap={1.5} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
              <TextField
                fullWidth
                size='small'
                placeholder='Cari Nama Ruangan'
                onChange={e => handleSearch(e.target.value)}
                sx={{ minWidth: 200, pr: 2 }}
              />
            </Box>
          }
          action={
            <Button
              variant='contained'
              color='primary'
              sx={{ mb: 2 }}
              onClick={() => setState(prev => ({ ...prev, isAdd: true }))}
              startIcon={<AddIcon />}
            >
              Tambah Laboratorium
            </Button>
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
        {state.isAdd && (
          <DialogCreateRuanganLaboratorium open={state.isAdd} onClose={() => handleCloseDialog('isAdd')} />
        )}

        {state.isEdit && (
          <DialogEditRuanganLaboratorium
            open={state.isEdit}
            onClose={() => handleCloseDialog('isEdit')}
            values={state.rowSelected}
          />
        )}

        {state.isDetail && (
          <DialogDetailRuanganLaboratorium
            open={state.isDetail}
            onClose={() => handleCloseDialog('isDetail')}
            values={state.rowSelected}
          />
        )}

        {state.isChange && (
          <DialogAssignKepalaLab
            open={state.isChange}
            onClose={() => handleCloseDialog('isChange')}
            values={state.rowSelected}
          />
        )}
      </Suspense>
    </>
  )
})

TableRuangan.displayName = 'TableRuangan'

export default TableRuangan
