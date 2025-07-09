import MatakuliahContainer from 'src/libs/master-data/mata-kuliah/containers'

const MatakuliahPage = () => {
  return <MatakuliahContainer />
}

MatakuliahPage.acl = {
  subject: 'MASTER_DATA',
  action: 'read'
}

export default MatakuliahPage
