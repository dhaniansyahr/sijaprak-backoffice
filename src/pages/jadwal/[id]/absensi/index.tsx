import AbsensiContainer from 'src/libs/jadwal/containers/Absensi'

const AbsensiPage = () => {
  return <AbsensiContainer />
}

AbsensiPage.acl = {
  subject: 'ABSENSI',
  action: 'read'
}

export default AbsensiPage
