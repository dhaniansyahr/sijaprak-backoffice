import { GridColDef } from '@mui/x-data-grid'
import { THistoryLabs } from 'src/stores/laboratorium/types'

export const useHistoryLab = () => {
  const columns: GridColDef<THistoryLabs>[] = [
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
      headerName: 'Nama Kepala Lab',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params?.row?.nama}</span>
      }
    },
    {
      flex: 0.25,
      field: 'nip',
      headerName: 'Nip Kepala Lab',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params?.row?.nip}</span>
      }
    },
    {
      flex: 0.25,
      field: 'jabatan',
      headerName: 'Masa Jabatan',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{'-'}</span>
      }
    }
  ]

  return { columns }
}
