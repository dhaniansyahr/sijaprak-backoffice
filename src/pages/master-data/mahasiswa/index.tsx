import MahasiswaContainer from 'src/libs/master-data/mahasiswa/containers'

const MahasiswaPage = () => {
  return <MahasiswaContainer />
}

MahasiswaPage.acl = {
  subject: 'MAHASISWA',
  action: 'read'
}

export default MahasiswaPage
