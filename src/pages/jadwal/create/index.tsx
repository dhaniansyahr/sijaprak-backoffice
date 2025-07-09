import CreateJadwal from 'src/libs/jadwal/containers/CreateJadwal'

const CreateJadwalPage = () => {
  return <CreateJadwal />
}

CreateJadwalPage.acl = {
  subject: 'JADWAL',
  action: 'create'
}

export default CreateJadwalPage
