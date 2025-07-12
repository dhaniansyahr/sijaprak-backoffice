import AbsensiContainer from 'src/libs/jadwal/containers/Absensi'

const AbsensiPage = () => {
  return <AbsensiContainer />
}

AbsensiPage.acl = {
  subject: 'JADWAL',
  action: 'absensi'
}

export default AbsensiPage
