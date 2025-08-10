import { GridColDef } from '@mui/x-data-grid'

export function createColumns(): GridColDef[] {
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
      headerName: 'Nama',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'npm',
      headerName: 'NPM',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'semester',
      headerName: 'Semester',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'tahunMasuk',
      headerName: 'Angkatan',
      sortable: false
    }
  ]
}
