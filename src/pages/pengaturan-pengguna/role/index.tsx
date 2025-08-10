import RoleContainer from 'src/libs/pengaturan-pengguna/role/containers'

const RoleManagementPage = () => {
  return <RoleContainer />
}

RoleManagementPage.acl = {
  subject: 'ROLE_MANAGEMENT',
  action: 'read'
}

export default RoleManagementPage
