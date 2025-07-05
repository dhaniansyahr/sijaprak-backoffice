import { lazy, Suspense, memo } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load the table component
const TableMahasiswa = lazy(() => import('../components/tables/TableMahasiswa'))

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
    <CircularProgress />
  </Box>
)

const MahasiswaContainer = memo(() => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TableMahasiswa />
    </Suspense>
  )
})

MahasiswaContainer.displayName = 'MahasiswaContainer'

export default MahasiswaContainer
