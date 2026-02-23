import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLocationCoverUrls } from '../api/mediaApi'
import SafeImage from '../components/SafeImage'
import { locations } from '../data/siteData'

const MotionDiv = motion.div

const fadeInUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

function getRegionFromLocationName(locationName) {
  const parts = locationName.split(',').map((part) => part.trim())
  const region = parts[1] ?? parts[0]
  if (region.toLowerCase() === 'jammu & kashmir') {
    return 'Jammu'
  }
  return region
}

function DestinationsPage() {
  const [coverUrls, setCoverUrls] = useState({})
  const [selectedRegion, setSelectedRegion] = useState('all')

  useEffect(() => {
    let mounted = true
    fetchLocationCoverUrls(locations).then((urls) => {
      if (mounted) {
        setCoverUrls(urls)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  const heroImage = coverUrls['shimla'] ?? ''

  const destinationsByRegion = useMemo(() => {
    const grouped = locations.reduce((accumulator, location) => {
      const region = getRegionFromLocationName(location.name)
      if (!accumulator[region]) {
        accumulator[region] = []
      }
      accumulator[region].push(location)
      return accumulator
    }, {})

    if (selectedRegion === 'all') {
      return grouped
    }

    return Object.fromEntries(
      Object.entries(grouped).filter(([region]) => region.toLowerCase() === selectedRegion.toLowerCase()),
    )
  }, [selectedRegion])

  return (
    <main className="page">
      <section className="destinations-hero">
        {heroImage ? <SafeImage src={heroImage} alt="Destination hero" className="destinations-hero-image" /> : null}
        <div className="destinations-hero-overlay" />
        <MotionDiv className="destinations-hero-content" {...fadeInUp}>
          <h1>
            Our Curated <em>Destinations</em>
          </h1>
          <p>
            Pick your dream destination for pre-wedding, wedding, and post-wedding shoots across Jammu, Srinagar,
            Himachal, and Punjab.
          </p>
          <a href="#destinations-grid" className="hero-btn hero-btn-secondary destinations-hero-btn">
            Explore Locations
          </a>
        </MotionDiv>
      </section>

      <section className="section destinations-page-grid-wrap" id="destinations-grid">
        <MotionDiv className="destinations-page-head" {...fadeInUp}>
          <div>
            <h2>
              Discover The <em>Magic</em>
            </h2>
            <div className="destinations-page-underline" />
          </div>
          <label className="destinations-filter-wrap" htmlFor="destinations-region-filter">
            <select
              id="destinations-region-filter"
              className="destinations-filter-select"
              aria-label="Filter destinations by region"
              value={selectedRegion}
              onChange={(event) => setSelectedRegion(event.target.value)}
            >
              <option value="all">All Destinations</option>
              <option value="jammu">Jammu</option>
              <option value="srinagar">Srinagar</option>
              <option value="himachal pradesh">Himachal Pradesh</option>
              <option value="punjab">Punjab</option>
            </select>
          </label>
        </MotionDiv>

        <div className="destinations-page-grid">
          {Object.entries(destinationsByRegion).map(([region, regionLocations]) => (
            <div key={region} className="destinations-region-block">
              <h3>{region}</h3>
              <div className="destinations-cards-grid">
                {regionLocations.map((location, index) => (
                  <MotionDiv
                    key={location.id}
                    className="destination-place-card"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                  >
                    <div className="destination-place-image-wrap">
                      <SafeImage
                        src={coverUrls[location.id]}
                        alt={location.name}
                        className="destination-place-image"
                      />
                      <span className="destination-region-pill">{region}</span>
                    </div>

                    <div className="destination-place-content">
                      <h4>{location.name.split(',')[0]}</h4>
                      <p>{location.vibe}</p>
                      <div className="destination-place-actions">
                        <Link to={`/gallery?location=${encodeURIComponent(location.name.split(',')[0])}`}>
                          View Gallery
                        </Link>
                        <Link className="destination-book-btn" to={`/booking?location=${encodeURIComponent(location.name)}`}>
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>
          ))}
        </div>

      </section>
    </main>
  )
}

export default DestinationsPage
