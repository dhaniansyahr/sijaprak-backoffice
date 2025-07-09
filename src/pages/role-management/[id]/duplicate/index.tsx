import DuplicateAkses from 'src/libs/role-management/containers/DuplicateAkses'

const DuplicateAksesPage = () => {
  return <DuplicateAkses />
}

DuplicateAksesPage.acl = {
  subject: 'ROLE_MANAGEMENT',
  action: 'create'
}

export default DuplicateAksesPage
