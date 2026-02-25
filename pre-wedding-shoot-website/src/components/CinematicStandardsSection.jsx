import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function CinematicStandardsSection() {
  return (
    <section className="section studio-standard-section">
      <Motion.div
        className="studio-standard-head"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
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
              <span className="studio-feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 9a2 2 0 0 1 2-2h1.12a2 2 0 0 0 1.66-.89l.82-1.22A2 2 0 0 1 10.27 4h3.46a2 2 0 0 1 1.67.89l.81 1.22A2 2 0 0 0 17.88 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              Best-in-Class Equipment
            </h3>
            <p>
              We use cinema-grade cameras and premium optics to preserve detail, color depth, and natural
              emotion in every frame.
            </p>
          </div>

          <div className="studio-feature-block">
            <h3>
              <span className="studio-feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="m16.86 3.49 3.65 3.65m-2.03-5.03a2.55 2.55 0 1 1 3.61 3.6L7 20.82H3.4v-3.6L18.5 2.11Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
              In-House Post-Production
            </h3>
            <p>
              Our editors hand-grade and retouch each image with a consistent cinematic style to deliver a
              polished story, not just isolated photos.
            </p>
          </div>

          <Link to="/booking" className="studio-book-btn">
            Book Your Experience
          </Link>
        </Motion.article>

        <Motion.figure
          className="studio-showcase"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <img
            src="https://assets.vogue.in/photos/662bf04608d6cfbc1b4e7fa8/3:4/w_2560%2Cc_limit/Unique%2520Weddings2.jpg"
            alt="Cinematic wedding photography setup"
            loading="lazy"
          />
        </Motion.figure>
      </div>
    </section>
  )
}

export default CinematicStandardsSection
