import { Icon } from '@iconify/react'
import { Box, Button, Chip, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Can from 'src/layouts/components/acl/Can'

interface ICreateColumnProps {
  onReject: (id: string) => void
  onApprove: (id: string) => void
}

export function createColumns({ onReject, onApprove }: ICreateColumnProps): GridColDef[] {
  return [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 80,
      sortable: false,
      renderCell: params => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nama',
      headerName: 'Nama Mata Kuliah',
      sortable: false,
      renderCell: params => {
        const isConflict = params?.row?.isOverride

        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isConflict && (
              <Tooltip title='Jadwal sudah ada'>
                <Icon icon='solar:danger-triangle-bold' width={20} color='#FCCF14' />
              </Tooltip>
            )}
            <span>{params?.row.jadwal?.matakuliah?.nama || '-'}</span>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'namaMahasiswa',
      headerName: 'Nama Mahasiswa',
      sortable: false,
      renderCell: params => {
        return <span>{params?.row?.mahasiswa?.nama || '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'npmMahasiswa',
      headerName: 'NPM Mahasiswa',
      sortable: false,
      renderCell: params => {
        return <span>{params?.row?.mahasiswa?.npm || '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nilaiTeori',
      headerName: 'Nilai Teori',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'nilaiPraktikum',
      headerName: 'Nilai Praktikum',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'nilaiAkhir',
      headerName: 'Nilai Akhir',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'status',
      headerName: 'Status',
      sortable: false,
      renderCell: params => {
        const color =
          params?.row?.status === 'DISETUJUI' ? 'primary' : params?.row?.status === 'DITOLAK' ? 'error' : 'secondary'

        return <Chip label={params?.row?.status} variant='outlined' color={color} />
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'Aksi',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Can I={'create'} a={'PENERIMAAN_ASISTEN_LAB'}>
              <Button
                variant='outlined'
                color='error'
                size='small'
                onClick={() => onReject(params.row?.id)}
                disabled={params?.row?.status !== 'PENDING'}
              >
                Tolak
              </Button>
              <Button
                variant='contained'
                size='small'
                onClick={() => onApprove(params?.row?.id)}
                disabled={params?.row?.status !== 'PENDING'}
              >
                Terima
              </Button>
            </Can>
          </Box>
        )
      }
    }
  ]
}
