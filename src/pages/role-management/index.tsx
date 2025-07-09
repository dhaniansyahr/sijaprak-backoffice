import RoleContainer from 'src/libs/role-management/containers'

const RoleManagementPage = () => {
  return <RoleContainer />
}

RoleManagementPage.acl = {
  subject: 'ROLE_MANAGEMENT',
  action: 'read'
}

export default RoleManagementPage
