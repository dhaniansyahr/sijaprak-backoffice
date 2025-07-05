import React from 'react'
import { DataGrid, gridClasses, DataGridProps } from '@mui/x-data-grid'
import { CircularProgress, Box } from '@mui/material'

// Generic interface for the table props
interface DataTableProps extends Omit<DataGridProps, 'rows' | 'columns' | 'loading' | 'onPaginationModelChange'> {
  data: any
  columns: any
  page?: number
  pageSize?: number
  isLoading: boolean
  onPaginationModelChange?: (newModel: any) => void
  checkboxSelection?: boolean
  disableRowSelectionOnClick?: boolean
  isRowSelectable?: (params: any) => boolean
  onRowSelectionModelChange?: (ids: any) => void
}

const DataTable = (props: DataTableProps) => {
  const { data, columns, page, pageSize, isLoading, onPaginationModelChange, ...rest } = props

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        {...rest}
        autoHeight
        getRowHeight={() => 'auto'}
        rows={data?.entries ?? []}
        columns={columns}
        pagination
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        rowCount={data?.totalData ?? 0}
        initialState={{
          pagination: {
            paginationModel: {
              page: (page ?? 0) - 1,
              pageSize: pageSize ?? 10
            }
          }
        }}
        onPaginationModelChange={onPaginationModelChange}
        loading={isLoading}
        slots={{
          loadingOverlay: CircularProgress
        }}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 2
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 600
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      />
    </Box>
  )
}

export default DataTable
