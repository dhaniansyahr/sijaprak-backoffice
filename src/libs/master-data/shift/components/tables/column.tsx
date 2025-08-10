import { Switch } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import Can from 'src/layouts/components/acl/Can'

export function createColumns({ onDelete }: { onDelete: (id: string) => void }): GridColDef[] {
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
      field: 'startTime',
      headerName: 'Start Time',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'endTime',
      headerName: 'End Time',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'isActive',
      headerName: 'Is Active',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return (
          <Can I={'delete'} a={'SHIFT'}>
            <Switch checked={params.row.isActive} color='success' onChange={e => onDelete(params?.row?.id)} />
          </Can>
        )
      }
    }
  ]
}
