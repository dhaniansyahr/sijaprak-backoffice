import MainPenerimaanAsistenContainer from 'src/libs/penerimaan-asisten/containers'

const PenerimaanAsistenPage = () => {
  return <MainPenerimaanAsistenContainer />
}

PenerimaanAsistenPage.acl = {
  subject: 'PENERIMAAN_ASISTEN_LAB',
  action: 'read'
}

export default PenerimaanAsistenPage
