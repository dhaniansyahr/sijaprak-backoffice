import CreateAkses from 'src/libs/pengaturan-pengguna/role/containers/CreateAkses'

const CreateAksesPage = () => {
  return <CreateAkses />
}

CreateAksesPage.acl = {
  subject: 'ROLE_MANAGEMENT',
  action: 'create'
}

export default CreateAksesPage
