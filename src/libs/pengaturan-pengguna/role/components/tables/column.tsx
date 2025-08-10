import { GridColDef } from '@mui/x-data-grid'
import { enumToCapitalize } from 'src/utils/string.format'
import MenuDropdown from './MenuDropdown'

interface ICreateColumnProps {
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
}

export default function createColumns({ onEdit, onDuplicate }: ICreateColumnProps): GridColDef[] {
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
      field: 'name',
      headerName: 'Nama Role',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{enumToCapitalize(params?.row?.name || '-')}</span>
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'Aksi',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <MenuDropdown onEdit={() => onEdit(params.row?.id)} onDuplicate={() => onDuplicate(params.row?.id)} />
      }
    }
  ]
}
