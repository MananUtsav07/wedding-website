import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchGalleryShotsWithUrls } from '../api/mediaApi'
import GallerySection from '../components/GallerySection'
import { galleryShots } from '../data/siteData'

function GalleryPage() {
  const [searchParams] = useSearchParams()
  const [shotsWithUrls, setShotsWithUrls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const selectedLocation = searchParams.get('location')

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

  const filteredShots = useMemo(() => {
    if (!selectedLocation) {
      return shotsWithUrls
    }

    const needle = selectedLocation.split(',')[0].trim().toLowerCase()
    return shotsWithUrls.filter((shot) => shot.location.toLowerCase().includes(needle))
  }, [selectedLocation, shotsWithUrls])

  return (
    <main className="page">
      <section className="section page-intro">
        <h1>Shoot Gallery</h1>
        <p>
          {selectedLocation
            ? `Showing sample photos for ${selectedLocation}.`
            : 'Explore completed pre-wedding shoots from Himachal, Punjab, and Jammu & Kashmir.'}
        </p>
        {selectedLocation && (
          <Link className="clear-filter" to="/gallery">
            View all locations
          </Link>
        )}
      </section>
      {isLoading ? (
        <section className="section">
          <h2>Recent Shoots</h2>
          <p className="section-subtitle">Loading photos...</p>
        </section>
      ) : (
        <GallerySection galleryShots={filteredShots} />
      )}
    </main>
  )
}

export default GalleryPage
