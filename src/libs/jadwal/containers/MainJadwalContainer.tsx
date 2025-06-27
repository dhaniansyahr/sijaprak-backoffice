import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import moment from 'moment'
import { Icon } from '@iconify/react'
import { NextRouter, useRouter } from 'next/router'
import { useTable } from '../hooks/useTable'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useAppDispatch, useAppSelector } from 'src/utils/dispatch'
import { getAllJadwal } from 'src/stores/jadwal/action'
import { LoadingButton } from '@mui/lab'

export default function MainJadwalContainer() {
  const dispatch = useAppDispatch()

  const { isRefresh } = useAppSelector(state => state.jadwal)

  const router: NextRouter = useRouter()

  const { columns, handleGenerate, isLoading: isLoad } = useTable()

  const [tabs, setTabs] = useState<string>('GROUP')

  const [data, setData] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true) // Start with true
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const handleGetAll = async (isPagination = false) => {
    setIsLoading(true)

    const body = {
      params: {
        page: isPagination ? page : 1,
        rows: pageSize,
        type: tabs
      }
    } as any

    // @ts-ignore
    await dispatch(getAllJadwal({ data: body })).then((res: any) => {
      if (
        !(res?.payload?.content?.entries ?? []).some((obj: any) =>
          (data?.entries ?? []).some((newObj: any) => obj.id === newObj.id)
        ) &&
        isPagination
      ) {
        const _entries = [...(data?.entries ?? []), ...(res?.payload?.content?.entries ?? [])]
        setData(Object.assign({}, res?.payload?.content, { entries: _entries }))
      } else {
        if (!res?.payload?.content?.entries?.length && res?.payload?.content?.totalPage === 1) {
          setData(null)
        } else if (!isPagination) {
          setData(res?.payload?.content)
        }
      }
    })

    setIsLoading(false)
  }

  useEffect(() => {
    setPage(1)

    handleGetAll(false)
  }, [tabs, isRefresh])

  useEffect(() => {
    if (page !== 1) {
      handleGetAll(true)
    }
  }, [page, pageSize])

  return (
    <Fragment>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box>
              <Typography variant='h6' fontWeight={500}>
                Jadwal Praktikum
              </Typography>
            </Box>
          }
          action={
            <Tabs
              value={tabs}
              onChange={(e, v) => {
                setTabs(v)
                setData(null)
              }}
            >
              <Tab label='Group' value='GROUP' />
              <Tab label='Table' value='TABLE' />
            </Tabs>
          }
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' },
            borderBottom: '1px solid #f4f4f4'
          }}
        />
      </Card>

      <Card>
        <CardHeader
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' }
          }}
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <LoadingButton
                variant='contained'
                color='primary'
                disabled={isLoad}
                onClick={handleGenerate}
                loading={isLoad}
                loadingIndicator={<CircularProgress size={20} />}
              >
                Generate
              </LoadingButton>
              <Button
                variant='contained'
                color='primary'
                onClick={() => router.push('/jadwal/create')}
                startIcon={<Icon icon='ic:baseline-add' />}
              >
                Tambah
              </Button>
            </Box>
          }
        />
        <CardContent>
          {tabs === 'GROUP' && (
            <>
              {isLoading && (
                <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
                  <CircularProgress />
                </Box>
              )}

              {!isLoading &&
                data?.entries &&
                data.entries.length > 0 &&
                data.entries.map((item: any, index: number) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<Icon icon='ep:arrow-up' />}>
                      <Box
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                      >
                        <Typography variant='body1'>{item?.hari || '-'}</Typography>
                        <Chip
                          color='primary'
                          variant='filled'
                          label={`${item?.schedules?.length || 0} Jadwal`}
                          sx={{
                            background: hexToRGBA('#050C43', 0.12),
                            color: '#050C43'
                          }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <DataGrid
                        autoHeight
                        rows={item?.schedules ?? []}
                        columns={columns}
                        hideFooter
                        loading={false}
                        slots={{
                          loadingOverlay: CircularProgress
                        }}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}

              {!isLoading && (!data?.entries || data.entries.length === 0) && (
                <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
                  <Typography variant='body1' color='textSecondary'>
                    Tidak ada jadwal tersedia
                  </Typography>
                </Box>
              )}
            </>
          )}

          {tabs === 'TABLE' && (
            <>
              {isLoading && !data && (
                <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
                  <CircularProgress />
                </Box>
              )}

              {(data || isLoading) && (
                <DataGrid
                  autoHeight
                  rows={data?.entries ?? []}
                  columns={columns}
                  pagination
                  disableColumnFilter
                  disableColumnMenu
                  disableColumnSelector
                  rowCount={data?.totalData ?? 0}
                  paginationModel={{
                    page: page - 1,
                    pageSize: pageSize
                  }}
                  onPaginationModelChange={(newModel: any) => {
                    setPage(newModel.page + 1)
                    setPageSize(newModel.pageSize)
                  }}
                  loading={isLoading}
                  slots={{
                    loadingOverlay: CircularProgress
                  }}
                  sx={{
                    [`& .${gridClasses.cell}`]: {
                      py: 1
                    }
                  }}
                />
              )}

              {!isLoading && (!data?.entries || data.entries.length === 0) && (
                <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
                  <Typography variant='body1' color='textSecondary'>
                    Tidak ada data jadwal tersedia
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Fragment>
  )
}
