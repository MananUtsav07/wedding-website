import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const studioTools = [
  {
    name: 'Canon EOS R5 C',
    summary: '8K RAW capture with strong low-light detail for sharp cinematic portraits.',
    specA: 'Cinema Sensor',
    specB: '8K Recording',
    image:
      'https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=1200&q=80',
    alt: 'Close-up of a professional camera body',
  },
  {
    name: 'Master Prime Lens Set',
    summary: 'Fast glass for clean bokeh, natural skin tones, and deep scene separation.',
    specA: 'Wide Aperture',
    specB: 'Prime Clarity',
    image:
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1200&q=80',
    alt: 'Professional lenses arranged on a table',
  },
  {
    name: 'DJI Ronin Stabilization',
    summary: 'Fluid movement for walking shots, couple reveals, and motion-rich sequences.',
    specA: '3-Axis Gimbal',
    specB: 'Smooth Tracking',
    image:
      'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Gimbal setup for cinematic filming',
  },
  {
    name: 'Color-Grade Workstation',
    summary: 'Managed monitors and precision grading tools for a consistent final gallery look.',
    specA: 'In-House Grading',
    specB: 'Retouch QA',
    image:
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Professional editing desk with calibrated screen',
  },
]

function CinematicStandardsSection() {
  const [activeToolIndex, setActiveToolIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveToolIndex((currentIndex) => (currentIndex + 1) % studioTools.length)
    }, 4200)

    return () => window.clearInterval(intervalId)
  }, [])

  const activeTool = studioTools[activeToolIndex]

  const goToPrevTool = () => {
    setActiveToolIndex((currentIndex) => (currentIndex - 1 + studioTools.length) % studioTools.length)
  }

  const goToNextTool = () => {
    setActiveToolIndex((currentIndex) => (currentIndex + 1) % studioTools.length)
  }

  return (
    <section className="section studio-standard-section">
      <div className="studio-standard-inner">
        <Motion.div
          className="studio-standard-head"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <p className="studio-standard-eyebrow">The Studio Standard</p>
          <h2>Cinematic Standards</h2>
          <p>Crafted with precision, edited with artistry.</p>
        </Motion.div>

        <div className="studio-standard-grid">
          <Motion.article
            className="studio-standard-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            <div className="studio-feature-block">
              <h3>
                <span className="studio-feature-label">The Gear</span>
                Full-frame cinema kit for texture-rich storytelling
              </h3>
              <p>
                We deploy 8K cinema sensors paired with premium primes and stabilized camera rigs so every
                frame keeps detail in attire, skin tone, and ambient light. From wide landscapes to close
                expressions, our kit stays sharp, steady, and intentional.
              </p>
              <div className="studio-feature-chips" aria-label="Primary gear">
                <span>Cinema EOS Bodies</span>
                <span>Master Prime Glass</span>
                <span>Ronin 4D Movement</span>
              </div>
            </div>

            <div className="studio-feature-block">
              <h3>
                <span className="studio-feature-label">The Edit</span>
                In-house post team, one visual language from start to finish
              </h3>
              <p>
                Our editors do not batch-fix images. They build your final story in stages: color grading,
                skin-tone balancing, texture-safe retouching, and sequence review. Every gallery is finished
                as a cohesive narrative, not just isolated files.
              </p>
              <ul className="studio-edit-list" aria-label="Editing workflow highlights">
                <li>Color team sets scene mood and keeps skin tones natural across every location.</li>
                <li>Retouch artists refine details while preserving fabric texture and real expressions.</li>
                <li>Final QA pass checks consistency before delivery so your gallery feels unified.</li>
              </ul>
            </div>

            <Link to="/booking" className="studio-book-btn">
              Secure Your Experience
            </Link>
          </Motion.article>

          <Motion.figure
            className="studio-showcase"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="studio-slider-frame">
              <Motion.img
                key={activeTool.image}
                src={activeTool.image}
                alt={activeTool.alt}
                loading="lazy"
                className="studio-slider-image"
                initial={{ opacity: 0.3, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
              <figcaption className="studio-slider-caption">
                <p className="studio-slider-eyebrow">Tool Spotlight</p>
                <h3>{activeTool.name}</h3>
                <p>{activeTool.summary}</p>
                <div className="studio-slider-specs">
                  <span>{activeTool.specA}</span>
                  <span>{activeTool.specB}</span>
                </div>
              </figcaption>
            </div>

            <div className="studio-slider-controls" aria-label="Tool slideshow controls">
              <button
                type="button"
                className="studio-slider-arrow"
                onClick={goToPrevTool}
                aria-label="Show previous tool"
              >
                &larr;
              </button>

              <div className="studio-slider-dots">
                {studioTools.map((tool, index) => (
                  <button
                    key={tool.name}
                    type="button"
                    className={`studio-slider-dot ${index === activeToolIndex ? 'active' : ''}`}
                    onClick={() => setActiveToolIndex(index)}
                    aria-label={`Show ${tool.name}`}
                    aria-current={index === activeToolIndex}
                  />
                ))}
              </div>

              <button
                type="button"
                className="studio-slider-arrow"
                onClick={goToNextTool}
                aria-label="Show next tool"
              >
                &rarr;
              </button>
            </div>
          </Motion.figure>
        </div>
      </div>
    </section>
  )
}

export default CinematicStandardsSection
