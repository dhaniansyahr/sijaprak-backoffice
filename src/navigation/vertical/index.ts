// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard'
    },
    {
      sectionTitle: 'Menu Management'
    },
    {
      title: 'Master Data',
      path: '/master-data',
      children: [
        {
          title: 'Mahasiswa',
          path: '/master-data/mahasiswa'
        },
        {
          title: 'Dosen',
          path: '/master-data/dosen'
        },
        {
          title: 'Mata Kuliah',
          path: '/master-data/mata-kuliah'
        },
        {
          title: 'Ruangan',
          path: '/master-data/ruangan'
        },
        {
          title: 'Shift',
          path: '/master-data/shift'
        }
      ]
    },
    {
      title: 'Jadwal',
      path: '/jadwal'
    },
    {
      title: 'Pendaftaran Asisten',
      path: '/pendaftaran-asisten'
    },
    {
      title: 'Penerimaan Asisten',
      path: '/penerimaan-asisten'
    },
    {
      sectionTitle: 'Others'
    },
    {
      title: 'Role Management',
      path: '/role-management'
    }
  ]
}

export default navigation
