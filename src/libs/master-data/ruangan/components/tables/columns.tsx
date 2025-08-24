import { Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Can from 'src/layouts/components/acl/Can'
import MenuDropdown from './MenuDropdown'

interface ICreateColumnProps {
  onDelete: (id: string) => void
  onDetail: (values: string) => void
  onEdit: (values: string) => void
  onChange: (values: string) => void
}

export function createColumns({ onChange, onDetail, onEdit, onDelete }: ICreateColumnProps): GridColDef[] {
  return [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 80,
      sortable: false,
      renderCell: params => <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
    },
    {
      flex: 0.25,
      field: 'nama',
      headerName: 'Nama Ruangan',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'namaKepalaLab',
      headerName: 'Kepala Lab',
      sortable: false,
      renderCell: params => <span>{params.row.namaKepalaLab ?? '-'}</span>
    },
    {
      flex: 0.25,
      field: 'nipKepalaLab',
      headerName: 'NIP',
      sortable: false,
      renderCell: params => <span>{params.row.nipKepalaLab ?? '-'}</span>
    },
    {
      flex: 0.25,
      field: 'lokasi',
      headerName: 'Lokasi Ruangan',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'kapasitas',
      headerName: 'Kapasitas Ruangan',
      sortable: false,
      renderCell: params => <span>{params.row.kapasitas ?? '-'}</span>
    },
    {
      flex: 0.25,
      field: 'isActive',
      headerName: 'Is Active',
      minWidth: 160,
      sortable: false,
      renderCell: params => (
        <Can I={'delete'} a={'RUANGAN'}>
          <Switch checked={params.row.isActive} color='success' onChange={() => onDelete(params.row.id)} size='small' />
        </Can>
      )
    },
    {
      flex: 0.25,
      field: 'actions',
      headerName: 'Aksi',
      minWidth: 160,
      sortable: false,
      renderCell: params => (
        <MenuDropdown
          onDetail={() => onDetail(params.row)}
          onEdit={() => onEdit(params.row)}
          onChange={() => onChange(params?.row)}
        />
      )
    }
  ]
}
