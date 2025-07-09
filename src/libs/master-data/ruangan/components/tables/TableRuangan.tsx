// React Imports
import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material'
import { lazy, Suspense, memo } from 'react'

// Hooks & types
import HeaderPage from 'src/components/shared/header-page'
import { useRuanganTable } from '../../hook/useRuanganTable'
import DataTable from 'src/components/shared/table'
import { AddIcon } from 'src/components/shared/icons'
import Can from 'src/layouts/components/acl/Can'

// Lazy load dialogs to reduce initial bundle size
const DialogCreateRuanganLaboratorium = lazy(() => import('../dialogs/DialogCreate'))
const DialogDetailRuanganLaboratorium = lazy(() => import('../dialogs/DialogDetail'))
const DialogEditRuanganLaboratorium = lazy(() => import('../dialogs/DialogEdit'))
const DialogAssignKepalaLab = lazy(() => import('../dialogs/DialogAssignKepalaLab'))

// Minimal loading fallback
const DialogLoader = () => null

const TableRuangan = memo(() => {
  // Hooks
  const { columns, row, addRef, editRef, detailRef, changeRef, tableState, setTableState, handleSearch } =
    useRuanganTable()

  const onPaginationModelChange = (newModel: any) => {
    setTableState(prev => ({ ...prev, page: newModel.page + 1, pageSize: newModel.pageSize }))
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
            <Can I={'create'} a={'RUANGAN'}>
              <Button
                variant='contained'
                color='primary'
                sx={{ mb: 2 }}
                onClick={() => addRef.current?.open()}
                startIcon={<AddIcon />}
              >
                Tambah Laboratorium
              </Button>
            </Can>
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
        <DialogCreateRuanganLaboratorium dialogRef={addRef} />

        <DialogEditRuanganLaboratorium dialogRef={editRef} values={row} />

        <DialogDetailRuanganLaboratorium dialogRef={detailRef} values={row} />

        <DialogAssignKepalaLab dialogRef={changeRef} values={row} />
      </Suspense>
    </>
  )
})

TableRuangan.displayName = 'TableRuangan'

export default TableRuangan
