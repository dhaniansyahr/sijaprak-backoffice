import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { streamingPerformance } from 'src/utils/performance'

export function useStreamingPerformance() {
  const router = useRouter()

  useEffect(() => {
    streamingPerformance()
  }, [router])
}
