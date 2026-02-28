import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchProfessionalPhotoUrls } from '../api/mediaApi'
import SafeImage from './SafeImage'

function ProfessionalsSection({ professionals }) {
  const [photoUrls, setPhotoUrls] = useState({})
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedStyle, setSelectedStyle] = useState('All Styles')
  const [selectedPrice, setSelectedPrice] = useState('Any Price')
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    let mounted = true

    const loadPhotos = async () => {
      const urls = await fetchProfessionalPhotoUrls(professionals)
      if (mounted) {
        setPhotoUrls(urls)
      }
    }

    loadPhotos()

    return () => {
      mounted = false
    }
  }, [professionals])

  const locationOptions = ['All Locations', ...new Set(professionals.map((pro) => pro.city))]
  const styleOptions = ['All Styles', ...new Set(professionals.map((pro) => pro.style))]
  const priceOptions = ['Any Price', ...new Set(professionals.map((pro) => pro.priceRange))]

  const filteredProfessionals = professionals.filter((pro) => {
    const matchesLocation = selectedLocation === 'All Locations' || pro.city === selectedLocation
    const matchesStyle = selectedStyle === 'All Styles' || pro.style === selectedStyle
    const matchesPrice = selectedPrice === 'Any Price' || pro.priceRange === selectedPrice
    const query = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !query ||
      pro.name.toLowerCase().includes(query) ||
      pro.type.toLowerCase().includes(query) ||
      pro.locationLabel.toLowerCase().includes(query)
    return matchesLocation && matchesStyle && matchesPrice && matchesSearch
  })

  const displayedProfessionals = filteredProfessionals.slice(0, visibleCount)
  const canLoadMore = displayedProfessionals.length < filteredProfessionals.length

  const clearFilters = () => {
    setSelectedLocation('All Locations')
    setSelectedStyle('All Styles')
    setSelectedPrice('Any Price')
    setSearchTerm('')
    setVisibleCount(6)
  }

  return (
    <section className="section professional-section">
      <div className="pros-filter-bar">
        <div className="pros-filter-group">
          <select value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
            {locationOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select value={selectedStyle} onChange={(event) => setSelectedStyle(event.target.value)}>
            {styleOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select value={selectedPrice} onChange={(event) => setSelectedPrice(event.target.value)}>
            {priceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <button type="button" className="clear-filter-btn" onClick={clearFilters}>
            Clear All
          </button>
        </div>

        <input
          className="pros-search"
          placeholder="Search by name or style..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="pros-cards-grid">
        {displayedProfessionals.map((pro, index) => (
          <Motion.article
            className="professional-card"
            key={pro.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
          >
            {pro.featured ? <span className="pro-badge">Premier Partner</span> : null}
            <SafeImage src={photoUrls[pro.id]} alt={pro.name} />
            <div className="professional-content">
              <h3>{pro.name}</h3>
              <p>{pro.type}</p>
              <div className="pro-location">{pro.locationLabel}</div>
              <Link to={`/professionals/${pro.id}`} className="pro-cta">
                View Profile
              </Link>
            </div>
          </Motion.article>
        ))}
      </div>

      {canLoadMore ? (
        <div className="pros-load-more-wrap">
          <button type="button" className="pros-load-more" onClick={() => setVisibleCount((prev) => prev + 4)}>
            Load More Professionals
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default ProfessionalsSection
