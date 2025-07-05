import { lazy, Suspense, memo } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load the table component
const TableRuangan = lazy(() => import('../components/tables/TableRuangan'))

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
    <CircularProgress />
  </Box>
)

const RuanganContainer = memo(() => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TableRuangan />
    </Suspense>
  )
})

RuanganContainer.displayName = 'RuanganContainer'

export default RuanganContainer
