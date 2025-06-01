// MUI Imports
import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material'

// Hooks & types
import { TRuanganLaboratorium } from 'src/stores/laboratorium/types'
import { useAppSelector } from 'src/utils/dispatch'

// Dialogs
import DialogCreateRuanganLaboratorium from '../dialogs/DialogCreate'
import DialogDetailRuanganLaboratorium from '../dialogs/DialogDetail'
import DialogEditRuanganLaboratorium from '../dialogs/DialogEdit'
import DialogAssignKepalaLab from '../dialogs/DialogAssignKepalaLab'
import { useGetAllRuangan } from 'src/stores/laboratorium/service'
import HeaderPage from 'src/components/shared/header-page'
import { useRuanganTable } from '../../hook/useRuanganTable'
import DefaultTable from 'src/components/shared/table'

export default function LaboratoriumTable() {
  const { isRefresh } = useAppSelector(state => state.ruanganLaboratorium)

  const { data, isLoadTable, page, pageSize, setPage, setPageSize, handleSearch } = useGetAllRuangan(isRefresh)

  // Hooks
  const {
    isDialogAddOpen,
    setIsDialogAddOpen,
    isDialogEditOpen,
    setIsDialogEditOpen,
    isDialogDetailOpen,
    setIsDialogDetailOpen,
    isDialogChangeOpen,
    setIsDialogChangeOpen,
    columns,
    rowSelected
  } = useRuanganTable()

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
                placeholder='Cari Nama'
                onChange={(e: any) => handleSearch(e.target.value)}
                sx={{ minWidth: 200, pr: 2 }}
              />
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button variant='contained' color='primary' sx={{ mb: 2 }} onClick={() => setIsDialogAddOpen(true)}>
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
          <DefaultTable<TRuanganLaboratorium>
            entries={data?.entries || []}
            columns={columns}
            totalData={data?.totalData || 0}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            isLoading={isLoadTable}
          />
        </CardContent>
      </Card>

      <DialogCreateRuanganLaboratorium open={isDialogAddOpen} onClose={() => setIsDialogAddOpen(false)} />

      <DialogEditRuanganLaboratorium
        open={isDialogEditOpen}
        onClose={() => setIsDialogEditOpen(false)}
        values={rowSelected}
      />

      <DialogDetailRuanganLaboratorium
        open={isDialogDetailOpen}
        onClose={() => setIsDialogDetailOpen(false)}
        values={rowSelected}
      />

      <DialogAssignKepalaLab
        open={isDialogChangeOpen}
        onClose={() => setIsDialogChangeOpen(false)}
        values={rowSelected as TRuanganLaboratorium}
      />
    </>
  )
}
