import React from 'react'
import { DataGrid, GridColDef, gridClasses, GridPaginationModel } from '@mui/x-data-grid'
import { CircularProgress, Box } from '@mui/material'

// Generic interface for the table props
interface IDefaultTableProps<T> {
  entries: T[]
  columns: GridColDef[]
  totalData: number
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  isLoading: boolean
  sx?: any
}

// Generic DefaultTable component
const DefaultTable = <T extends Record<string, any>>(props: IDefaultTableProps<T>) => {
  const { entries, columns, totalData, page, pageSize, setPage, setPageSize, isLoading, sx = {}, ...restProps } = props

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPage(newModel.page + 1) // Convert 0-based to 1-based
    setPageSize(newModel.pageSize)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        {...restProps}
        autoHeight
        getRowHeight={row => 'auto'}
        rows={entries}
        columns={columns}
        pagination
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        rowCount={totalData}
        paginationModel={{
          page: page - 1,
          pageSize: pageSize
        }}
        onPaginationModelChange={handlePaginationModelChange}
        loading={isLoading}
        slots={{
          loadingOverlay: CircularProgress
        }}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 1
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 600
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover'
          },
          ...sx
        }}
      />
    </Box>
  )
}

export default DefaultTable
