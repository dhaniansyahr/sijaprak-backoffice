import { AnyAbility } from '@casl/ability'
import { Icon } from '@iconify/react'
import { Box, Tooltip } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import MenuDropdown from './MenuDropdown'

interface ICreateColumnsProps {
  ability: AnyAbility
  onAssignAsisten: (id: string) => void
  onEditJadwal: (id: string) => void
  onEditPertemuan: (id: string) => void
  onDetail: (id: string) => void
  onDetailAbsensi: (id: string) => void
}

export function createColumns({
  ability,
  onAssignAsisten,
  onEditJadwal,
  onEditPertemuan,
  onDetail,
  onDetailAbsensi
}: ICreateColumnsProps): GridColDef[] {
  const isActionAllowed =
    ability?.can('read', 'JADWAL') ||
    ability?.can('read', 'ABSENSI') ||
    ability?.can('assign', 'JADWAL') ||
    ability?.can('update', 'JADWAL') ||
    ability?.can('delete', 'JADWAL')

  const baseColumns: GridColDef[] = [
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
      sortable: false,
      renderCell: params => {
        const isConflict = params?.row?.isOverride

        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isConflict && (
              <Tooltip title='Jadwal sudah ada'>
                <Icon icon='solar:danger-triangle-bold' width={20} color='#FCCF14' />
              </Tooltip>
            )}
            <span>{params?.row.matakuliah?.nama || '-'}</span>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'hari',
      headerName: 'Hari',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'kelas',
      headerName: 'Kelas',
      sortable: false
    },
    {
      flex: 0.25,
      field: 'shiftTime',
      headerName: 'Waktu Shift',
      sortable: false,
      renderCell: params => {
        return <span>{`${params.row.shift.startTime} - ${params.row.shift.endTime}`}</span>
      }
    },
    {
      flex: 0.25,
      field: 'ruangan',
      headerName: 'Ruangan',
      sortable: false,
      renderCell: params => {
        return <span>{params.row?.ruangan?.nama}</span>
      }
    },
    {
      flex: 0.25,
      field: 'dosen',
      headerName: 'Dosen Pengampu',
      sortable: false,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {params.row.dosen?.map((item: any, index: number) => (
              <span key={index}>
                {item?.nama} ({item?.nip})
              </span>
            ))}
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'aslab',
      headerName: 'Asisten Lab',
      sortable: false,
      renderCell: params => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {params.row.asisten?.map((item: any, index: number) => (
              <span key={index}>
                {item?.Mahasiswa?.[0]?.nama} ({item?.Mahasiswa?.[0]?.npm})
              </span>
            ))}
          </Box>
        )
      }
    }
  ]

  if (isActionAllowed) {
    baseColumns.push({
      flex: 0.25,
      field: 'action',
      headerName: 'Aksi',
      sortable: false,
      renderCell: params => {
        return (
          <MenuDropdown
            onAssignAsisten={() => onAssignAsisten(params.row?.id)}
            onEditJadwal={() => onEditJadwal(params.row?.id)}
            onDetail={() => onDetail(params.row?.id)}
            onDetailAbsensi={() => onDetailAbsensi(params.row?.id)}
            onEditPertemuan={() => onEditPertemuan(params.row?.id)}
          />
        )
      }
    })
  }

  return baseColumns
}
