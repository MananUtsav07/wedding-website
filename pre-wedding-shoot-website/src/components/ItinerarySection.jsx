import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { fetchItinerarySlidesWithUrls } from '../api/mediaApi'
import SafeImage from './SafeImage'

function ItinerarySection({ packages, slidesByPackage }) {
  const [resolvedSlidesByPackage, setResolvedSlidesByPackage] = useState({})
  const [activeSlideIndexes, setActiveSlideIndexes] = useState({})

  useEffect(() => {
    let isMounted = true

    const loadSlides = async () => {
      const packageEntries = Object.entries(slidesByPackage || {})
      const resolvedEntries = await Promise.all(
        packageEntries.map(async ([packageId, packageSlides]) => {
          const safeSlides = Array.isArray(packageSlides) ? packageSlides : []
          const slidesWithImages = await fetchItinerarySlidesWithUrls(safeSlides)
          return [packageId, slidesWithImages]
        }),
      )

      if (!isMounted) {
        return
      }

      const nextResolvedSlidesByPackage = Object.fromEntries(resolvedEntries)
      const nextActiveIndexes = Object.fromEntries(
        Object.keys(nextResolvedSlidesByPackage).map((packageId) => [packageId, 0]),
      )

      setResolvedSlidesByPackage(nextResolvedSlidesByPackage)
      setActiveSlideIndexes(nextActiveIndexes)
    }

    loadSlides()
    return () => {
      isMounted = false
    }
  }, [slidesByPackage])

  useEffect(() => {
    const packageIds = Object.keys(resolvedSlidesByPackage)
    if (!packageIds.length) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlideIndexes((currentIndexes) => {
        const nextIndexes = { ...currentIndexes }

        packageIds.forEach((packageId) => {
          const packageSlides = resolvedSlidesByPackage[packageId] || []
          if (packageSlides.length <= 1) {
            return
          }
          const current = Number.isInteger(currentIndexes[packageId]) ? currentIndexes[packageId] : 0
          nextIndexes[packageId] = (current + 1) % packageSlides.length
        })

        return nextIndexes
      })
    }, 3600)

    return () => window.clearInterval(intervalId)
  }, [resolvedSlidesByPackage])

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
        {packages.map((item, index) => {
          const packageId = item.id || `package-${index}`
          const packageSlides = resolvedSlidesByPackage[packageId] || []
          const activeSlideIndex = Number.isInteger(activeSlideIndexes[packageId])
            ? activeSlideIndexes[packageId]
            : 0
          const activeSlide = packageSlides[activeSlideIndex]

          return (
          <Motion.article
            key={packageId}
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
                  alt={`${item.title} slideshow image ${activeSlideIndex + 1}`}
                  className="itinerary-slide-image"
                />
              ) : (
                <div className="itinerary-slide-image itinerary-slide-loading">Loading slideshow...</div>
              )}
            </figure>

            {packageSlides.length > 1 ? (
              <div className="itinerary-slide-dots" aria-label="Itinerary slideshow progress">
                {packageSlides.map((slide, slideIndex) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`itinerary-slide-dot ${slideIndex === activeSlideIndex ? 'active' : ''}`}
                    onClick={() =>
                      setActiveSlideIndexes((currentIndexes) => ({
                        ...currentIndexes,
                        [packageId]: slideIndex,
                      }))
                    }
                    aria-label={`Show ${item.title} image ${slideIndex + 1}`}
                    aria-current={slideIndex === activeSlideIndex}
                  />
                ))}
              </div>
            ) : null}
          </Motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default ItinerarySection
