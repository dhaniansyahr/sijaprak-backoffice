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
      sectionTitle: 'Menu Management',
      subject: 'MASTER_DATA',
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
          subject: 'MASTER_DATA',
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
      title: 'Jadwal',
      path: '/jadwal',
      subject: 'JADWAL',
      action: 'read'
    },
    {
      title: 'Pendaftaran Asisten',
      path: '/pendaftaran-asisten',
      subject: 'PENDAFTARAN_ASISTEN_LAB',
      action: 'read'
    },
    {
      title: 'Penerimaan Asisten',
      path: '/penerimaan-asisten',
      subject: 'PENERIMAAN_ASISTEN_LAB',
      action: 'read'
    },
    {
      sectionTitle: 'Others',
      subject: 'ROLE_MANAGEMENT',
      action: 'read'
    },
    {
      title: 'Role Management',
      path: '/role-management',
      subject: 'ROLE_MANAGEMENT',
      action: 'read'
    }
  ]
}

export default navigation
