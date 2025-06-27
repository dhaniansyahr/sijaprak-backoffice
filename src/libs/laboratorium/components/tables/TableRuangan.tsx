// MUI Imports
import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material'

// Hooks & types
import { TRuanganLaboratorium } from 'src/stores/laboratorium/types'

// Dialogs
import DialogCreateRuanganLaboratorium from '../dialogs/DialogCreate'
import DialogDetailRuanganLaboratorium from '../dialogs/DialogDetail'
import DialogEditRuanganLaboratorium from '../dialogs/DialogEdit'
import DialogAssignKepalaLab from '../dialogs/DialogAssignKepalaLab'
import HeaderPage from 'src/components/shared/header-page'
import { useRuanganTable } from '../../hook/useRuanganTable'
import DefaultTable from 'src/components/shared/table'
import { Icon } from '@iconify/react'

export default function TableRuangan() {
  // Hooks
  const { columns, state, setState, tableState, setTableState, handleSearch } = useRuanganTable()

  return (
    <>
      <Card>
        <HeaderPage title='Manajemen Ruangan Laboratorium' />

        <CardHeader
          title={
            <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
              <TextField
                fullWidth
                size='small'
                placeholder='Cari Nama Ruangan'
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
                sx={{ mb: 2 }}
                onClick={() => setState({ ...state, isAdd: true })}
                startIcon={<Icon icon='ic:baseline-add' />}
              >
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
        <CardContent>
          <DefaultTable<TRuanganLaboratorium>
            entries={tableState.data?.entries || []}
            columns={columns}
            totalData={tableState.data?.totalData || 0}
            page={tableState.page}
            pageSize={tableState.pageSize}
            setPage={page => setTableState(prev => ({ ...prev, page }))}
            setPageSize={pageSize => setTableState(prev => ({ ...prev, pageSize }))}
            isLoading={tableState.isLoading}
          />
        </CardContent>
      </Card>

      <DialogCreateRuanganLaboratorium open={state.isAdd} onClose={() => setState({ ...state, isAdd: false })} />

      <DialogEditRuanganLaboratorium
        open={state.isEdit}
        onClose={() => setState({ ...state, isEdit: false })}
        values={state.rowSelected}
      />

      <DialogDetailRuanganLaboratorium
        open={state.isDetail}
        onClose={() => setState({ ...state, isDetail: false })}
        values={state.rowSelected}
      />

      <DialogAssignKepalaLab
        open={state.isChange}
        onClose={() => setState({ ...state, isChange: false })}
        values={state.rowSelected as TRuanganLaboratorium}
      />
    </>
  )
}
