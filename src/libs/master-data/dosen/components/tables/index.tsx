// React Imports
import { Box, Card, CardContent, CardHeader, debounce, TextField } from '@mui/material'
import { memo, useCallback, useEffect, useState } from 'react'

// Hooks & types
import HeaderPage from 'src/components/shared/header-page'
import DataTable from 'src/components/shared/table'

import { GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import { getAllDosen } from 'src/stores/master-data/dosen/action'
import { createColumns } from './column'

const TableDosen = memo(() => {
  const [search, setSearch] = useState('')

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  const columns = createColumns()

  return (
    <Card>
      <HeaderPage title='Manajemen Dosen' />

      <CardHeader
        title={
          <Box display='flex' flexWrap='wrap' gap={1.5} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari Nama Dosen'
              onChange={e => handleSearch(e.target.value)}
              sx={{ minWidth: 200, pr: 2 }}
            />
          </Box>
        }
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'start', md: 'center' },
          borderBottom: '1px solid #f4f4f4'
        }}
      />

      <CardContent>
        <DosenEntries search={search} columns={columns} />
      </CardContent>
    </Card>
  )
})

export default TableDosen

const DosenEntries = memo(({ search, columns }: { search: string; columns: GridColDef[] }) => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.dosen)

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(100)

  const handleGetData = async (isPagination = false) => {
    setIsLoading(true)

    const body: any = {
      params: {
        page: isPagination ? page : 1,
        rows: rows,
        searchFilters: {
          nama: search
        }
      }
    }

    if (!search || search === '') delete body.params.searchFilters

    // @ts-ignore
    await dispatch(getAllDosen({ data: body }))
      .then((res: any) => {
        if (
          !(res.payload.content?.entries ?? []).some((obj: any) =>
            (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
          ) &&
          isPagination
        ) {
          const _entries = [...(data?.entries ?? []), ...(res.payload.content?.entries ?? [])]
          setData(Object.assign({}, res.payload.content, { entries: _entries }))
        } else {
          if (!res.payload.content?.entries?.length && res.payload.content?.totalPage === 1) {
            setData(null)
          } else if (!isPagination) {
            setData(res.payload.content)
          }
        }
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    setPage(1)
    handleGetData(false)
  }, [isRefresh, search])

  useEffect(() => {
    if (page !== 1) {
      handleGetData(true)
    }
  }, [page, rows])

  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={{
        page: page,
        rows: rows,
        setPage: setPage,
        setRows: setRows
      }}
      isLoading={isLoading}
    />
  )
})
