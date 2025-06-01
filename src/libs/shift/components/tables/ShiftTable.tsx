import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material'
import { Fragment } from 'react'
import CreateShiftDialog from '../dialogs/DialogAdd'
import { Icon } from '@iconify/react'
import { TShift } from 'src/stores/shift/types'
import { useAppSelector } from 'src/utils/dispatch'
import { useGetAllShifts } from 'src/stores/shift/service'
import { useShiftTable } from '../../hooks/useShitTable'
import DefaultTable from 'src/components/shared/table'
import HeaderPage from 'src/components/shared/header-page'

export default function ShiftTable() {
  const { isRefresh } = useAppSelector(state => state.shift)

  // Fetch Data
  const { data, isLoadTable, page, setPage, pageSize, setPageSize, handleSearch } = useGetAllShifts(isRefresh)

  // Hooks Table
  const { columns, isAddDialogOpen, setIsAddDialogOpen, isLoading: isUpdating } = useShiftTable()

  const isLoading = isLoadTable || isUpdating

  return (
    <Fragment>
      <Card elevation={4}>
        <HeaderPage title='Management Shift' />

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
        <CardContent style={{ paddingInline: '10px' }}>
          <DefaultTable<TShift>
            entries={data?.entries || []}
            columns={columns}
            totalData={data?.totalData || 0}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <CreateShiftDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </Fragment>
  )
}
