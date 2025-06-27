import { Icon } from '@iconify/react'
import { MenuItem } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ActionTable from 'src/components/shared/action-table'
import { generateJawdal } from 'src/stores/jadwal/action'
import { TJadwal } from 'src/stores/jadwal/types'
import { useAppDispatch } from 'src/utils/dispatch'

export const useTable = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [isMenuOpen, setIsMenuOpen] = useState<any>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(generateJawdal({ data: {} })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        setIsLoading(false)
        toast.error(res.payload?.response?.data?.message)

        return
      }

      setIsLoading(false)
      toast.success(res.payload.message)
    })
  }

  const columns: GridColDef<TJadwal>[] = [
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
      headerName: 'Nama Mata Kuliah',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params?.row.matakuliah?.nama || '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'shiftTime',
      headerName: 'Waktu Shift',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{`${params.row.shift.startTime} - ${params.row.shift.endTime}`}</span>
      }
    },
    {
      flex: 0.25,
      field: 'dosen',
      headerName: 'Dosen Pengampu',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params.row.dosen.nama || '-'}</span>

        // return (
        //   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        //     {params.row.dosen?.map((item: any, index: number) => (
        //       <span key={index}>{item?.name}</span>
        //     ))}
        //   </Box>
        // )
      }
    },
    {
      flex: 0.25,
      field: 'aslab',
      headerName: 'Asisten Lab',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return <span>{params?.row?.asistenLabId || '-'}</span>

        // return (
        //   <>
        //     {params?.row?.data?.asistenLab?.map((item: any, index: number) => (
        //       <span key={index}>{item?.name}</span>
        //     ))}
        //   </>
        // )
      }
    },
    {
      flex: 0.25,
      field: 'action',
      headerName: 'Aksi',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        return (
          <ActionTable
            id={params?.row?.id}
            open={isMenuOpen}
            onOpen={() => setIsMenuOpen(params.row.id)}
            onClose={() => setIsMenuOpen('')}
          >
            <MenuItem
              sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
              onClick={() => {
                setIsMenuOpen('')
                router.push(`/jadwal/${params?.row?.id}/assign-assisten`)
              }}
            >
              <Icon icon='solar:user-id-broken' />
              <span>Tambahkan Asisten Lab</span>
            </MenuItem>

            <MenuItem
              sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
              onClick={() => {
                setIsMenuOpen('')
                router.push(`/jadwal/${params?.row?.id}/edit`)
              }}
            >
              <Icon icon='mdi:pencil-outline' />
              <span>Edit Praktikum</span>
            </MenuItem>

            <MenuItem
              sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
              onClick={() => {
                setIsMenuOpen('')
                router.push(`/jadwal/${params?.row?.id}/detail`)
              }}
            >
              <Icon icon='ph:eye' />
              <span>Detail Praktikum</span>
            </MenuItem>

            <MenuItem
              sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'start' }}
              onClick={() => {
                setIsMenuOpen('')
                router.push(`/jadwal/${params?.row?.id}/pengajuan-pergantian`)
              }}
            >
              <Icon icon='mdi:trash-outline' />
              <span>Ajukan Pergantian Jadwal</span>
            </MenuItem>
          </ActionTable>
        )
      }
    }
  ]

  return {
    columns,
    isLoading,
    handleGenerate
  }
}
