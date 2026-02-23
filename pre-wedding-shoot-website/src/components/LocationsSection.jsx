import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
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
      <Motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        Top Shoot Destinations
      </Motion.h2>
      <Motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        Click a destination to view matching location gallery.
      </Motion.p>
      <div className="grid three destination-grid">
        {locations.map((place, index) => (
          <Motion.div
            key={place.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link
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
          </Motion.div>
        ))}
      </div>
    </section>
  )
}

export default LocationsSection
