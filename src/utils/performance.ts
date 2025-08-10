export function streamingPerformance() {
  if (typeof window === 'undefined') return // Prevent SSR crash

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paintEntries = performance.getEntriesByType('paint')

  if (!navigation) return

  // Time to First Byte (TTFB)
  const ttfb = navigation.responseStart

  // First Contentful Paint (FCP)
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime

  console.log('TTFB:', Math.round(ttfb) + 'ms')
  console.log('FCP:', Math.round(fcp || 0) + 'ms')

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    new PerformanceObserver(list => {
      const lcp = list.getEntries().at(-1)?.startTime
      console.log('LCP:', Math.round(lcp || 0) + 'ms')
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  }
}
