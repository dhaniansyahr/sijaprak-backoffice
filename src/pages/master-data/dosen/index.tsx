import DosenContainer from 'src/libs/master-data/dosen/containers'

const DosenPage = () => {
  return <DosenContainer />
}

DosenPage.acl = {
  subject: 'DOSEN',
  action: 'read'
}

export default DosenPage
