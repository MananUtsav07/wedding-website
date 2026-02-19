import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <p className="eyebrow">Handpicked Pre-Wedding Experiences</p>
          <h1>
            Capture Your <em>Love Story</em>
          </h1>
          <p>
            Handpicked photographers for your most cherished moments in breathtaking landscapes.
          </p>
          <div className="hero-actions">
            <Link to="/professionals" className="hero-btn hero-btn-primary">
              Explore Professionals
            </Link>
            <Link to="/gallery" className="hero-btn hero-btn-secondary">
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
