import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView } from '../utils/analytics'

function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}`
    trackPageView(pagePath)
  }, [location.pathname, location.search])

  return null
}

export default AnalyticsTracker

