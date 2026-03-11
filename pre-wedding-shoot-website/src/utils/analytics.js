const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

const canUseDom = typeof window !== 'undefined' && typeof document !== 'undefined'
const analyticsEnabled = Boolean(MEASUREMENT_ID) && canUseDom

let initialized = false
let lastTrackedPath = ''

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments)
    }
}

export function initAnalytics() {
  if (!analyticsEnabled || initialized) {
    return
  }

  ensureDataLayer()
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })

  if (!document.getElementById('ga4-script')) {
    const script = document.createElement('script')
    script.id = 'ga4-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
    document.head.appendChild(script)
  }

  initialized = true
}

export function trackPageView(path) {
  if (!analyticsEnabled) {
    return
  }

  if (!initialized) {
    initAnalytics()
  }

  if (typeof window.gtag !== 'function') {
    return
  }

  const pagePath = path || `${window.location.pathname}${window.location.search}`
  if (pagePath === lastTrackedPath) {
    return
  }
  lastTrackedPath = pagePath

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(eventName, params = {}) {
  if (!analyticsEnabled) {
    return
  }

  if (!initialized) {
    initAnalytics()
  }

  if (typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', eventName, params)
}

export function isAnalyticsEnabled() {
  return analyticsEnabled
}

