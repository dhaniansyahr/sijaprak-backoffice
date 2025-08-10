import { GridColDef } from '@mui/x-data-grid'
import MenuDropdown from './MenuDropdown'

interface ICreateColumnProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function createColumns({ onEdit, onDelete }: ICreateColumnProps): GridColDef[] {
  return [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 80,
      renderCell: params => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'formName',
      headerName: 'Nama',
      minWidth: 160,
      renderCell: params => {
        return <span>{params.row?.fullName ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'email',
      headerName: 'Email',
      minWidth: 160,
      renderCell: params => {
        return <span>{params.row?.email ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'role',
      headerName: 'Role',
      minWidth: 160,
      renderCell: params => {
        return <span>{params.row?.role?.name ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'Aksi',
      minWidth: 160,
      renderCell: params => {
        return <MenuDropdown onEdit={() => onEdit(params.row?.id)} onDelete={() => onDelete(params.row?.id)} />
      }
    }
  ]
}
