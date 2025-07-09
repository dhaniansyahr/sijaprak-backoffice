import CreateAkses from 'src/libs/role-management/containers/CreateAkses'

const CreateAksesPage = () => {
  return <CreateAkses />
}

CreateAksesPage.acl = {
  subject: 'ROLE_MANAGEMENT',
  action: 'create'
}

export default CreateAksesPage
