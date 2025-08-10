import { lazy, Suspense, memo } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load the table component
const TableDosen = lazy(() => import('../components/tables'))

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
    <CircularProgress />
  </Box>
)

const DosenContainer = memo(() => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TableDosen />
    </Suspense>
  )
})

DosenContainer.displayName = 'DosenContainer'

export default DosenContainer
