import React from 'react'
import { DataGrid, gridClasses, DataGridProps } from '@mui/x-data-grid'
import { CircularProgress, Box } from '@mui/material'

interface IPaginationProps {
  page: number
  rows: number
  setPage: (page: number) => void
  setRows: (rows: number) => void
}
interface DataTableProps extends Omit<DataGridProps, 'rows' | 'columns' | 'loading' | 'pagination'> {
  data: any
  columns: any
  pagination?: IPaginationProps
  isLoading: boolean
}

const DataTable = (props: DataTableProps) => {
  const { data, columns, isLoading, pagination, ...rest } = props

  const onPaginationModel = (newModel: any) => {
    pagination?.setPage(newModel.page + 1)
    pagination?.setRows(newModel.rows)
  }

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
              page: (pagination?.page ?? 0) - 1,
              pageSize: pagination?.rows ?? 10
            }
          }
        }}
        onPaginationModelChange={onPaginationModel}
        loading={isLoading}
        slots={{
          loadingOverlay: CircularProgress
        }}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 2
          }
        }}
      />
    </Box>
  )
}

export default DataTable
