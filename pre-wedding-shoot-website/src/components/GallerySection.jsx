import SafeImage from './SafeImage'

function GallerySection({ galleryShots }) {
  if (!galleryShots.length) {
    return (
      <section className="section">
        <h2>Recent Shoots</h2>
        <p className="section-subtitle">No photos found for this location yet. Try another destination.</p>
      </section>
    )
  }

  return (
    <section className="section">
      <h2>Recent Shoots</h2>
      <div className="gallery">
        {galleryShots.map((shot) => (
          <figure key={shot.title} className="gallery-item">
            <SafeImage src={shot.image} alt={`${shot.title} in ${shot.location}`} />
            <figcaption>
              <strong>{shot.title}</strong>
              <span>{shot.location}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default GallerySection
