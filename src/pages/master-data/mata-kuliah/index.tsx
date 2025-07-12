import MatakuliahContainer from 'src/libs/master-data/mata-kuliah/containers'

const MatakuliahPage = () => {
  return <MatakuliahContainer />
}

MatakuliahPage.acl = {
  subject: 'MATA_KULIAH',
  action: 'read'
}

export default MatakuliahPage
