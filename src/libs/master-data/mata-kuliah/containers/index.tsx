import { lazy, Suspense, memo } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load the table component
const TableMatakuliah = lazy(() => import('../components/tables'))

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
    <CircularProgress />
  </Box>
)

const MatakuliahContainer = memo(() => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TableMatakuliah />
    </Suspense>
  )
})

MatakuliahContainer.displayName = 'MatakuliahContainer'

export default MatakuliahContainer
