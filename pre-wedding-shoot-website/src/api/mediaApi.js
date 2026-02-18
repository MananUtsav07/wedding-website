import samplePhoto from '../assets/fallback-photo.svg'

// Replace this implementation with real CMS requests later.
async function fetchMediaUrlByKey(mediaKey) {
  void mediaKey
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
