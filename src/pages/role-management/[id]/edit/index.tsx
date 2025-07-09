import EditAkses from 'src/libs/role-management/containers/EditAkses'

const EditAksesPage = () => {
  return <EditAkses />
}

EditAksesPage.acl = {
  subject: 'ROLE_MANAGEMENT',
  action: 'update'
}

export default EditAksesPage
