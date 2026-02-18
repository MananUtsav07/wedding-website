import { useEffect, useState } from 'react'
import { fetchProfessionalPhotoUrls } from '../api/mediaApi'
import SafeImage from './SafeImage'

function ProfessionalsSection({ professionals }) {
  const [photoUrls, setPhotoUrls] = useState({})

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

  return (
    <section className="section professional-section">
      <h2>Registered Photographers & Companies</h2>
      <p className="section-subtitle">Trusted teams for cinematic, traditional, and editorial shoots.</p>
      <div className="grid three professionals-grid">
        {professionals.map((pro) => (
          <article className="professional-card" key={pro.id}>
            <SafeImage src={photoUrls[pro.id]} alt={pro.name} />
            <div className="professional-content">
              <h3>{pro.name}</h3>
              <p>{pro.type}</p>
              <div className="professional-tags">
                <span>{pro.city}</span>
                {pro.specialty ? <span>{pro.specialty}</span> : null}
              </div>
              <div className="meta">Rating: {pro.rating}</div>
              <div className="meta">Completed Shoots: {pro.shoots}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProfessionalsSection
