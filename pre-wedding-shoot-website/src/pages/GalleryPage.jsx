import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchGalleryShotsWithUrls } from '../api/mediaApi'
import SafeImage from '../components/SafeImage'
import { galleryShots } from '../data/siteData'

const INITIAL_VISIBLE_SHOOTS = 6
const LOAD_MORE_COUNT = 3

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

const MotionDiv = motion.div
const MotionArticle = motion.article

function getLocationLabel(shotLocation) {
  return shotLocation.split(',')[0].trim()
}

function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [shotsWithUrls, setShotsWithUrls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_SHOOTS)
  const activeLocationFilter = searchParams.get('location') || 'all'

  useEffect(() => {
    let mounted = true

    const loadGallery = async () => {
      const shots = await fetchGalleryShotsWithUrls(galleryShots)
      if (mounted) {
        setShotsWithUrls(shots)
        setIsLoading(false)
      }
    }

    loadGallery()
    return () => {
      mounted = false
    }
  }, [])

  const locationFilters = useMemo(() => {
    const uniqueLocations = Array.from(new Set(shotsWithUrls.map((shot) => getLocationLabel(shot.location))))
    return ['all', ...uniqueLocations]
  }, [shotsWithUrls])

  const filteredShoots = useMemo(() => {
    if (activeLocationFilter === 'all') {
      return shotsWithUrls
    }

    const normalizedFilter = activeLocationFilter.trim().toLowerCase()
    return shotsWithUrls.filter((shot) => getLocationLabel(shot.location).toLowerCase() === normalizedFilter)
  }, [activeLocationFilter, shotsWithUrls])

  const visibleShoots = useMemo(
    () => filteredShoots.slice(0, Math.min(visibleCount, filteredShoots.length)),
    [filteredShoots, visibleCount],
  )

  const canLoadMore = visibleCount < filteredShoots.length
  const showingCount = visibleShoots.length

  const handleLoadMore = () => {
    setVisibleCount((currentCount) => Math.min(currentCount + LOAD_MORE_COUNT, filteredShoots.length))
  }

  const handleFilterChange = (location) => {
    const nextParams = new URLSearchParams(searchParams)
    if (location === 'all') {
      nextParams.delete('location')
    } else {
      nextParams.set('location', location)
    }
    setSearchParams(nextParams)
    setVisibleCount(INITIAL_VISIBLE_SHOOTS)
  }

  return (
    <main className="page">
      <section className="section gallery-page">
        <MotionDiv className="gallery-hero" {...fadeInUp}>
          <span className="gallery-kicker">Portfolio</span>
          <h1>Our Recent Shoots</h1>
          <p>
            Capturing love across Himachal, Punjab, and Jammu & Kashmir. Browse sample destination shoots and find
            your dream setting.
          </p>
        </MotionDiv>

        {isLoading ? (
          <p className="section-subtitle">Loading photos...</p>
        ) : (
          <>
            <MotionDiv className="gallery-filter-bar" {...fadeInUp}>
              <label className="gallery-filter-label" htmlFor="gallery-location-filter">
                Location
              </label>
              <select
                id="gallery-location-filter"
                className="gallery-filter-select"
                value={activeLocationFilter}
                onChange={(event) => handleFilterChange(event.target.value)}
              >
                {locationFilters.map((location) => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Shoots' : location}
                  </option>
                ))}
              </select>
            </MotionDiv>

            {!filteredShoots.length ? (
              <p className="section-subtitle">No shoots found for this location yet.</p>
            ) : (
              <>
                <div className="gallery-masonry">
                  {visibleShoots.map((shot, index) => (
                    <MotionArticle
                      key={`${shot.location}-${index}`}
                      className="gallery-masonry-item"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                    >
                      <SafeImage src={shot.image} alt={`${shot.title} in ${shot.location}`} className="gallery-shot-image" />
                      <div className="gallery-shot-overlay">
                        <p>{shot.location}</p>
                        <h3>{shot.title}</h3>
                        <span>See Full Shoot</span>
                      </div>
                    </MotionArticle>
                  ))}
                </div>

                <MotionDiv className="gallery-load-more-wrap" {...fadeInUp}>
                  {canLoadMore && (
                    <button type="button" className="gallery-load-more-btn" onClick={handleLoadMore}>
                      Load More Shoots
                    </button>
                  )}
                  <p>
                    Showing {showingCount} of {filteredShoots.length} shoots
                  </p>
                </MotionDiv>
              </>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default GalleryPage
