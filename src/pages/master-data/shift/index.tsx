import ShiftContainer from 'src/libs/master-data/shift/containers'

const ShiftPage = () => {
  return <ShiftContainer />
}

ShiftPage.acl = {
  subject: 'SHIFT',
  action: 'read'
}

export default ShiftPage
