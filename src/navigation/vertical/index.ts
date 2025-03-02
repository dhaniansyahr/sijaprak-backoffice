// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'mdi:home-outline'
    },
    {
      sectionTitle: 'Menu Management'
    },
    {
      title: 'Laboratorium',
      path: '/laboratorium',
      icon: 'fluent:conference-room-24-regular'
    },
    {
      title: 'Shift',
      path: '/shift',
      icon: 'fluent:shifts-activity-24-regular'
    },
    {
      title: 'Jadwal',
      path: '/jadwal',
      icon: 'uil:schedule'
    },
    {
      title: 'Absensi',
      path: '/absensi',
      icon: 'ic:baseline-fingerprint'
    },
    {
      title: 'Pendaftaran Asisten',
      path: '/pendaftaran-asisten',
      icon: 'material-symbols-light:app-registration-outline-rounded'
    },
    {
      title: 'Penerimaan Asisten',
      path: '/penerimaan-asisten',
      icon: 'material-symbols:order-approve'
    },
    {
      sectionTitle: 'Others'
    },
    {
      title: 'Role Management',
      path: '/role-management',
      icon: 'ix:user-management'
    }
  ]
}

export default navigation
