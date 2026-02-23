import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <Motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h1>
            Capture Your <em>Love Story</em>
          </h1>
          <p>
            Handpicked photographers for your most cherished moments in breathtaking landscapes.
          </p>
          <Motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <Link to="/professionals" className="hero-btn hero-btn-secondary">
              Explore Professionals
            </Link>
            <Link to="/destinations" className="hero-btn hero-btn-secondary">
              Explore Destinations
            </Link>
            <Link to="/gallery" className="hero-btn hero-btn-secondary">
              View Gallery
            </Link>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  )
}

export default Hero
