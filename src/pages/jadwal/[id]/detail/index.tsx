import DetailJadwal from 'src/libs/jadwal/containers/DetailJadwal'

const DetailJadwalPage = () => {
  return <DetailJadwal />
}

DetailJadwalPage.acl = {
  subject: 'JADWAL',
  action: 'read'
}

export default DetailJadwalPage
