import { Icon } from '@iconify/react'
import { Box, Button, Card, CardContent, CardHeader, debounce, TextField } from '@mui/material'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { createColumns } from './column'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import DataTable from 'src/components/shared/table'
import DialogsUser, { IDialogsUserRef } from '../dialogs'
import HeaderPage from 'src/components/shared/header-page'
import { getAllUsers } from 'src/stores/users/action'

export default function TablePengguna() {
  const [search, setSearch] = useState('')
  const [id, setId] = useState('')

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  const dialogdRef = useRef<IDialogsUserRef>(null)

  const columns = createColumns({
    onEdit: (id: string) => dialogdRef.current?.openDialogEdit(id),
    onDelete: (id: string) => dialogdRef.current?.openDialogDelete(id)
  })

  const onOpenDialogAdd = () => dialogdRef.current?.openDialogAdd()

  return (
    <Card>
      <HeaderPage title='Manajemen Pengguna' />

      <CardHeader
        title={
          <Box padding={'0px 10px'}>
            <TextField
              fullWidth
              onChange={e => handleSearch(e.target.value)}
              size='small'
              placeholder='Search by keyword (Nama, Email, Role, Department)'
              InputProps={{
                startAdornment: (
                  <Box display='flex' alignItems='center' mr={1.5}>
                    <Icon icon='lucide:search' width={18} />
                  </Box>
                )
              }}
            />
          </Box>
        }
        action={
          <Box display='flex' gap={2} alignItems='center'>
            <Button
              variant='contained'
              color='primary'
              startIcon={<Icon icon='lucide:plus' />}
              sx={{
                fontWeight: 500
              }}
              onClick={onOpenDialogAdd}
            >
              Pengguna Baru
            </Button>
          </Box>
        }
        sx={{
          borderBottom: '1px solid #4C4E641F',
          mb: 2
        }}
      />

      <CardContent>
        <UserEntries search={search} columns={columns} />
      </CardContent>

      <DialogsUser ref={dialogdRef} id={id} setId={setId} />
    </Card>
  )
}

const UserEntries = memo(({ search, columns }: { search: string; columns: GridColDef[] }) => {
  const dispatch = useAppDispatch()
  const { isRefresh } = useAppSelector(state => state.user)

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(10)

  const handleGetData = async (isPagination = false) => {
    setIsLoading(true)

    const body: any = {
      params: {
        page: isPagination ? page : 1,
        rows: rows,
        searchFilters: {
          fullName: search,
          email: search
        }
      }
    }

    if (!search || search === '') delete body.params.searchFilters

    // @ts-ignore
    await dispatch(getAllUsers({ data: body }))
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
