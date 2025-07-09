import RuanganContainer from 'src/libs/master-data/ruangan/containers'

const RuanganPage = () => {
  return <RuanganContainer />
}

RuanganPage.acl = {
  subject: 'RUANGAN',
  action: 'read'
}

export default RuanganPage
