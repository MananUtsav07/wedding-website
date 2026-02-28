import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { fetchItinerarySlidesWithUrls } from '../api/mediaApi'
import SafeImage from './SafeImage'

function ItinerarySection({ packages, sharedSlides }) {
  const [slides, setSlides] = useState([])
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadSlides = async () => {
      const slidesWithImages = await fetchItinerarySlidesWithUrls(sharedSlides)
      if (!isMounted) {
        return
      }
      setSlides(slidesWithImages)
      setActiveSlideIndex(0)
    }

    loadSlides()
    return () => {
      isMounted = false
    }
  }, [sharedSlides])

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % slides.length)
    }, 3600)

    return () => window.clearInterval(intervalId)
  }, [slides.length])

  const activeSlide = slides[activeSlideIndex]

  return (
    <section className="section itinerary-section">
      <Motion.div
        className="itinerary-head"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <p className="itinerary-eyebrow">Our Itinerary</p>
        <h2>Your life, our lens, pure magic.</h2>
      </Motion.div>

      <div className="itinerary-grid">
        {packages.map((item, index) => (
          <Motion.article
            key={item.title}
            className="itinerary-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <figure className="itinerary-slide-frame">
              {activeSlide ? (
                <SafeImage
                  src={activeSlide.image}
                  alt={`${item.title} couple setup at ${activeSlide.location}`}
                  className="itinerary-slide-image"
                />
              ) : (
                <div className="itinerary-slide-image itinerary-slide-loading">Loading slideshow...</div>
              )}

              <figcaption className="itinerary-slide-caption">
                {activeSlide ? activeSlide.location : 'Preparing slideshow'}
              </figcaption>
            </figure>

            {slides.length > 1 ? (
              <div className="itinerary-slide-dots" aria-label="Itinerary slideshow progress">
                {slides.map((slide, slideIndex) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`itinerary-slide-dot ${slideIndex === activeSlideIndex ? 'active' : ''}`}
                    onClick={() => setActiveSlideIndex(slideIndex)}
                    aria-label={`Show ${slide.location}`}
                    aria-current={slideIndex === activeSlideIndex}
                  />
                ))}
              </div>
            ) : null}
          </Motion.article>
        ))}
      </div>
    </section>
  )
}

export default ItinerarySection

