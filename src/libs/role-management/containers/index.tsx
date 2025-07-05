import { lazy, memo, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'

const TableRole = lazy(() => import('../components/tables/TableRoleManagement'))

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
    <CircularProgress />
  </Box>
)

const RoleContainer = memo(() => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TableRole />
    </Suspense>
  )
})

RoleContainer.displayName = 'RoleContainer'

export default RoleContainer
