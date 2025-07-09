// import DashboardContainers from 'src/libs/dashboard/containers/DashboardContainers'
import EnhancedDashboard from 'src/libs/dashboard/containers/EnhancedDashboard'

const Dashboard = () => {
  return <EnhancedDashboard />
}

Dashboard.acl = {
  action: 'read',
  subject: 'DASHBOARD'
}

export default Dashboard
