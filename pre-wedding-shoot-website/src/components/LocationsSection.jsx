import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLocationCoverUrls } from '../api/mediaApi'
import SafeImage from './SafeImage'

function LocationsSection({ locations }) {
  const [coverUrls, setCoverUrls] = useState({})

  useEffect(() => {
    let mounted = true

    const loadCovers = async () => {
      const urls = await fetchLocationCoverUrls(locations)
      if (mounted) {
        setCoverUrls(urls)
      }
    }

    loadCovers()

    return () => {
      mounted = false
    }
  }, [locations])

  return (
    <section className="section location-section" id="destinations">
      <h2>Top Shoot Destinations</h2>
      <p className="section-subtitle">Click a destination to view matching location gallery.</p>
      <div className="grid three destination-grid">
        {locations.map((place, index) => (
          <Link
            key={place.name}
            className="destination-link"
            style={{ animationDelay: `${index * 90}ms` }}
            to={`/gallery?location=${encodeURIComponent(place.name)}`}
          >
            <article className="destination-card">
              <SafeImage src={coverUrls[place.id]} alt={place.name} />
              <div className="destination-content">
                <h3>{place.name}</h3>
                <p>{place.name.split(',')[1]?.trim() || 'North India'}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default LocationsSection
