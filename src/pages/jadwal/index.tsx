import JadwalContainer from 'src/libs/jadwal/containers'

const Jadwal = () => {
  return <JadwalContainer />
}

Jadwal.acl = {
  subject: 'JADWAL',
  action: 'read'
}

export default Jadwal
