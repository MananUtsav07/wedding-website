import samplePhoto from '../assets/fallback-photo.svg'

const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL || '').trim().replace(/\/+$/, '')
const MEDIA_MANIFEST_URL = (import.meta.env.VITE_MEDIA_MANIFEST_URL || '').trim()

let mediaManifestPromise
let hasLoggedManifestIssue = false

function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(value)
}

function resolveMediaPath(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') {
    return ''
  }

  if (isAbsoluteUrl(pathOrUrl)) {
    return pathOrUrl
  }

  if (!MEDIA_BASE_URL) {
    return ''
  }

  return `${MEDIA_BASE_URL}/${pathOrUrl.replace(/^\/+/, '')}`
}

function logManifestIssueOnce(message, extra) {
  if (hasLoggedManifestIssue) {
    return
  }
  hasLoggedManifestIssue = true
  console.warn(message, extra || '')
}

async function loadMediaManifest() {
  if (!MEDIA_MANIFEST_URL) {
    logManifestIssueOnce(
      '[mediaApi] VITE_MEDIA_MANIFEST_URL is not set. S3 media mapping is disabled; sample fallback images will be used.',
    )
    return {}
  }

  if (!mediaManifestPromise) {
    mediaManifestPromise = fetch(MEDIA_MANIFEST_URL, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          logManifestIssueOnce(
            `[mediaApi] Failed to load media manifest (${response.status}). Check bucket policy/CORS and manifest URL.`,
            MEDIA_MANIFEST_URL,
          )
          return {}
        }

        const payload = await response.json()
        if (!payload || typeof payload !== 'object') {
          logManifestIssueOnce('[mediaApi] Media manifest JSON is invalid.', MEDIA_MANIFEST_URL)
          return {}
        }
        return payload
      })
      .catch((error) => {
        logManifestIssueOnce(
          '[mediaApi] Could not fetch media manifest. Check CORS, public access, and URL.',
          error,
        )
        return {}
      })
  }

  return mediaManifestPromise
}

async function fetchMediaUrlByKey(mediaKey) {
  const manifest = await loadMediaManifest()
  const mappedFromManifest = resolveMediaPath(manifest?.[mediaKey])
  if (mappedFromManifest) {
    return mappedFromManifest
  }

  // Legacy hardcoded URL fallback intentionally removed.
  // If key is missing in S3 manifest, use local sample fallback.
  return samplePhoto
}

export async function fetchLocationCoverUrls(locations) {
  const pairs = await Promise.all(
    locations.map(async (location) => [location.id, await fetchMediaUrlByKey(location.coverMediaKey)]),
  )
  return Object.fromEntries(pairs)
}

export async function fetchProfessionalPhotoUrls(professionals) {
  const pairs = await Promise.all(
    professionals.map(async (pro) => [pro.id, await fetchMediaUrlByKey(pro.profileMediaKey)]),
  )
  return Object.fromEntries(pairs)
}

export async function fetchGalleryShotsWithUrls(shots) {
  return Promise.all(
    shots.map(async (shot) => ({
      ...shot,
      image: await fetchMediaUrlByKey(shot.mediaKey),
    })),
  )
}

export async function fetchItinerarySlidesWithUrls(slides) {
  return Promise.all(
    slides.map(async (slide) => ({
      ...slide,
      image: await fetchMediaUrlByKey(slide.mediaKey),
    })),
  )
}
