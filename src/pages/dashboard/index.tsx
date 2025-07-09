import DashboardContainers from 'src/libs/dashboard/containers/DashboardContainers'

const Dashboard = () => {
  return <DashboardContainers />
}

Dashboard.acl = {
  action: 'read',
  subject: 'DASHBOARD'
}

export default Dashboard
