import { Box, CircularProgress } from '@mui/material'
import { lazy, memo, Suspense } from 'react'

const TableShift = lazy(() => import('../components/tables/TableShift'))

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
    <CircularProgress />
  </Box>
)

const ShiftContainer = memo(() => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TableShift />
    </Suspense>
  )
})

export default ShiftContainer
