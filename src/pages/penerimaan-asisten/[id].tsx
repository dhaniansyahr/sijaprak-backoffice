import PelamarContainer from 'src/libs/penerimaan-asisten/containers/Pelamar'

const PelamarPage = () => {
  return <PelamarContainer />
}

PelamarPage.acl = {
  subject: 'PENERIMAAN_ASISTEN_LAB',
  action: 'read'
}

export default PelamarPage
