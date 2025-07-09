import MainPendaftaranAsistenContainer from 'src/libs/pendaftaran-asisten/containers'

const PendaftaranAsistenPage = () => {
  return <MainPendaftaranAsistenContainer />
}

PendaftaranAsistenPage.acl = {
  subject: 'PENDAFTARAN_ASISTEN_LAB',
  action: 'read'
}

export default PendaftaranAsistenPage
