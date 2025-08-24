import { Box, Button, Card, CardContent, CardHeader, CircularProgress, debounce, TextField } from '@mui/material'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import HeaderPage from 'src/components/shared/header-page'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import DataTable from 'src/components/shared/table'
import Can, { AbilityContext } from 'src/layouts/components/acl/Can'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import { checkJadwalTeoriExist, deleteAllJadwal, generateJawdal, getAllJadwal } from 'src/stores/jadwal/action'
import { GridColDef } from '@mui/x-data-grid'
import DialogJadwals, { IDialogsJadwalRef } from '../dialogs'
import { createColumns } from './columns'
import { useAbility } from '@casl/react'
import toast from 'react-hot-toast'
import { setIsRefresh } from 'src/stores/jadwal/slice'

const TableJadwal = () => {
  const router = useRouter()
  const ability = useAbility(AbilityContext)

  const [search, setSearch] = useState('')
  const [id, setId] = useState('')
  const [isRegenerate, setIsRegenerate] = useState(false)

  const dialogsRef = useRef<IDialogsJadwalRef>(null)

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearch(query)
    }, 300),
    []
  )

  const columns = createColumns({
    ability,
    onAssignAsisten: (id: string) => dialogsRef.current?.openAssignAsisten(id),
    onEditPertemuan: (id: string) => dialogsRef.current?.openEditPertemuan(id),
    onDetail: (id: string) => router.push(`/jadwal/${id}/detail`),
    onDetailAbsensi: (id: string) => router.push(`/jadwal/${id}/absensi`),
    onEditJadwal: (id: string) => dialogsRef.current?.openEditDialog(id)
  })

  const onBulkUpload = () => dialogsRef.current?.openBulkUpload()
  const onOpenDialogAdd = () => dialogsRef.current?.openAddDialog()

  return (
    <Card>
      <HeaderPage title='Management Jadwal' />

      <CardHeader
        title={
          <Box display={'flex'} flexWrap={'wrap'} gap={'12px'} sx={{ mb: { xs: 8, md: 0 }, width: '100%' }}>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari Jadwal'
              onChange={e => handleSearch(e.target.value)}
              sx={{ minWidth: 200, pr: 2 }}
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Can I={'generate'} a={'JADWAL'}>
              <GenerateJadwal isRegenerate={isRegenerate} openDialog={onBulkUpload} />
            </Can>

            <Can I={'create'} a={'JADWAL'}>
              <Button
                variant='contained'
                color='primary'
                onClick={onOpenDialogAdd}
                startIcon={<Icon icon='ic:baseline-add' />}
              >
                Tambah
              </Button>
            </Can>
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
        <JadwalEntries search={search} columns={columns || []} setIsRegenerate={setIsRegenerate} />
      </CardContent>

      <DialogJadwals id={id} setId={setId} ref={dialogsRef} />
    </Card>
  )
}

export default TableJadwal

const JadwalEntries = memo(
  ({
    search,
    columns,
    setIsRegenerate
  }: {
    search: string
    columns: GridColDef[]
    setIsRegenerate: (v: boolean) => void
  }) => {
    const dispatch = useAppDispatch()
    const { isRefresh } = useAppSelector(state => state.jadwal)

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
            'matakuliah.nama': search
          }
        }
      }

      if (!search || search === '') delete body.params.searchFilters

      // @ts-ignore
      await dispatch(getAllJadwal({ data: body }))
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
        .finally(() => {
          setIsLoading(false)
          setIsRegenerate(data?.entries?.length > 0)
        })
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
  }
)

const GenerateJadwal = memo(({ isRegenerate, openDialog }: { isRegenerate: boolean; openDialog: () => void }) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [isTeoriExist, setIsTeoriExist] = useState(false)

  const onGenerate = async () => {
    if (!isRegenerate) setIsLoading(true)

    // @ts-ignore
    await dispatch(generateJawdal())
      .then(res => {
        if (res.meta.requestStatus !== 'fulfilled') {
          toast.error(res.payload?.response?.data?.message)

          return
        }

        toast.success(res.payload.message)
        dispatch(setIsRefresh())
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onCheckTeoriExist = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(checkJadwalTeoriExist())
      .then(res => {
        if (res.meta.requestStatus !== 'fulfilled') {
          toast.error(res.payload?.response?.data?.message)

          return
        }

        const content = res?.payload?.content

        setIsTeoriExist(content)
        onSubmit()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onDeleteAll = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(deleteAllJadwal())
      .then(async res => {
        if (res.meta.requestStatus !== 'fulfilled') {
          setIsLoading(false)
          toast.error(res.payload?.response?.data?.message)

          return
        }

        // await onGenerate()

        dispatch(setIsRefresh())
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onSubmit = async () => {
    if (isTeoriExist) {
      // if (!isRegenerate) {
      //   await onDeleteAll()
      // } else {
      openDialog()

      // }
    } else {
      await onGenerate()
    }
  }

  return (
    <LoadingButton
      variant='outlined'
      color='primary'
      loading={isLoading}
      loadingIndicator={<CircularProgress size={20} />}
      onClick={openDialog}
      startIcon={<Icon icon='mdi:refresh' />}
    >
      {isRegenerate ? 'Re-Generate' : 'Generate'}
    </LoadingButton>
  )
})
