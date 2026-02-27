import samplePhoto from '../assets/fallback-photo.svg'

const mediaLibrary = {
  'location-shimla-cover':
    'https://www.clubmahindra.com/blog/media/section_images/shuttersto-026b0fa609daf35.jpg',
  'location-manali-cover':
    'https://upload.wikimedia.org/wikipedia/commons/0/03/Manali_City.jpg',
  'location-dharamshala-cover':
    'https://s7ap1.scene7.com/is/image/incredibleindia/dharamshala-cricket-stadium-dharamshala-himachal-pradesh-city-1-hero?qlt=82&ts=1742168918706',
  'location-dalhousie-cover':
    'https://vargiskhan.com/log/wp-content/uploads/2020/06/dalousie.jpg',
  'location-amritsar-cover':
    'https://amritsartourism.org.in/images/places-to-visit/headers/places-to-visit-in-amritsar-header-amritsar-tourism.jpg.jpg',
  'location-patiala-cover':
    'https://upload.wikimedia.org/wikipedia/commons/6/6f/NSNIS.png',
  'location-ludhiana-cover':
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/25/d1/29/photo1jpg.jpg?w=1200&h=700&s=1',
  'location-jalandhar-cover':
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Devi_Talab_Mandir.jpg',
  'location-srinagar-cover':
    'https://www.ekashmirtourism.com/wp-content/uploads/2022/08/dal-lake-winter.jpg',
  'location-patnitop-cover':
    'https://s7ap1.scene7.com/is/image/incredibleindia/1-patnitop-jammu-city-hero?qlt=82&ts=1726729003276',
  'location-mansar-lake-cover':
    'https://statetimes.in/wp-content/uploads/2025/04/Mansarfff.jpg',
  'location-mansar-cover':
    'https://statetimes.in/wp-content/uploads/2025/04/Mansarfff.jpg',
  'location-sanasar-cover':
    'https://s7ap1.scene7.com/is/image/incredibleindia/sanasar-patnitop-jammu-&-kashmir-4-attr-hero?qlt=82&ts=1727353656438',
  'professional-arjun-sharma':
    'https://images.unsplash.com/photo-1591389703636-e15a1cc1d64f?auto=format&fit=crop&w=900&q=80',
  'professional-priya-kapoor':
    'https://images.unsplash.com/photo-1610041321327-b7941c8f5d68?auto=format&fit=crop&w=900&q=80',
  'professional-vikram-singh':
    'https://images.unsplash.com/photo-1621784563330-caee0b138a00?auto=format&fit=crop&w=900&q=80',
  'professional-saira-khan':
    'https://images.unsplash.com/photo-1595064085577-7c2ef98ec311?auto=format&fit=crop&w=900&q=80',
  'professional-rohan-mehra':
    'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?auto=format&fit=crop&w=900&q=80',
  'professional-anjali-verma':
    'https://images.unsplash.com/photo-1609252509102-aa73ff792667?auto=format&fit=crop&w=900&q=80',

  'gallery-shimla-1':
    'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80',
  'gallery-shimla-2':
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1400&q=80',
  'gallery-manali-1':
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
  'gallery-dharamshala-1':
    'https://images.unsplash.com/photo-1637065583561-b9f2ee7d1f38?auto=format&fit=crop&w=1400&q=80',
  'gallery-dalhousie-1':
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80',
  'gallery-amritsar-1':
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
  'gallery-amritsar-2':
    'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?auto=format&fit=crop&w=1400&q=80',
  'gallery-patiala-1':
    'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1400&q=80',
  'gallery-ludhiana-1':
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80',
  'gallery-jalandhar-1':
    'https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&w=1400&q=80',
  'gallery-srinagar-1':
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1400&q=80',
  'gallery-srinagar-2':
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
  'gallery-himachal-1':
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
  'gallery-patnitop-1':
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
  'gallery-mansar-1':
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1400&q=80',
  'gallery-sanasar-1':
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1400&q=80',
}

// Replace this implementation with real CMS requests later.
async function fetchMediaUrlByKey(mediaKey) {
  return mediaLibrary[mediaKey] ?? samplePhoto
}

export async function fetchLocationCoverUrls(locations) {
  const pairs = await Promise.all(
    locations.map(async (location) => [location.id, await fetchMediaUrlByKey(location.coverMediaKey)]),
  )
  return Object.fromEntries(pairs)
}

export async function fetchProfessionalPhotoUrls(professionals) {
  const pairs = await Promise.all(
    professionals.map(async (pro) => [pro.id, samplePhoto]),
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
