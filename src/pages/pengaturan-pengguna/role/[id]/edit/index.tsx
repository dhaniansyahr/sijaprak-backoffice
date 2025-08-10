import EditAkses from 'src/libs/pengaturan-pengguna/role/containers/EditAkses'

const EditAksesPage = () => {
  return <EditAkses />
}

EditAksesPage.acl = {
  subject: 'ROLE_MANAGEMENT',
  action: 'update'
}

export default EditAksesPage
