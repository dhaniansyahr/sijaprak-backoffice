// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      subject: 'DASHBOARD',
      action: 'read'
    },
    {
      title: 'Jadwal',
      path: '/jadwal',
      subject: 'JADWAL',
      action: 'read'
    },
    {
      title: 'Master Data',
      path: '/master-data',
      subject: 'MASTER_DATA',
      action: 'read',
      children: [
        {
          title: 'Mahasiswa',
          path: '/master-data/mahasiswa',
          subject: 'MAHASISWA',
          action: 'read'
        },
        {
          title: 'Dosen',
          path: '/master-data/dosen',
          subject: 'DOSEN',
          action: 'read'
        },
        {
          title: 'Mata Kuliah',
          path: '/master-data/mata-kuliah',
          subject: 'MATA_KULIAH',
          action: 'read'
        },
        {
          title: 'Ruangan',
          path: '/master-data/ruangan',
          subject: 'RUANGAN',
          action: 'read'
        },
        {
          title: 'Shift',
          path: '/master-data/shift',
          subject: 'SHIFT',
          action: 'read'
        }
      ]
    },
    {
      title: 'Asisten Lab',
      path: '/asisten-lab',
      subject: 'PENDAFTARAN_ASISTEN_LAB',
      action: 'read',
      children: [
        {
          title: 'Pendaftaran',
          path: '/asisten-lab/pendaftaran',
          subject: 'PENDAFTARAN_ASISTEN_LAB',
          action: 'read'
        },
        {
          title: 'Penerimaan',
          path: '/asisten-lab/penerimaan',
          subject: 'PENERIMAAN_ASISTEN_LAB',
          action: 'read'
        }
      ]
    },
    {
      title: 'Pengaturan Pengguna',
      path: '/pengaturan-pengguna',
      subject: 'ROLE_MANAGEMENT',
      action: 'read',
      children: [
        {
          title: 'Manajemen Penggunan',
          path: '/pengaturan-pengguna/user',
          subject: 'PENERIMAAN_ASISTEN_LAB',
          action: 'read'
        },
        {
          title: 'Manajemen Role',
          path: '/pengaturan-pengguna/role',
          subject: 'ROLE_MANAGEMENT',
          action: 'read'
        }
      ]
    }
  ]
}

export default navigation
