import PenggunaContainer from 'src/libs/pengaturan-pengguna/user/containers'

const RoleManagementPage = () => {
  return <PenggunaContainer />
}

RoleManagementPage.acl = {
  subject: 'ROLE_MANAGEMENT',
  action: 'read'
}

export default RoleManagementPage
