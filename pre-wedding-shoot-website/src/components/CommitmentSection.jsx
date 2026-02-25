import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = Motion(Link)

const points = [
  {
    title: 'Verified Professionals',
    description: 'Only top-tier, vetted artists with proven portfolios and a commitment to excellence.',
    to: '/professionals',
  },
  {
    title: 'Curated Locations',
    description: 'Exclusive access to handpicked locations for breathtaking and timeless couple frames.',
    to: '/destinations',
  },
  {
    title: 'Hassle-Free Booking',
    description: 'Seamless scheduling, secure payments, and easy planning from one place.',
    to: '/booking',
  },
]

function CommitmentSection() {
  return (
    <section className="section commitment-section">
      <Motion.div
        className="commitment-head"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="commitment-eyebrow">Our Commitment</p>
          <h2>Why Choose Our Platform</h2>
        </div>
        <p>
          We provide a seamless experience for couples looking to document their journey with curated
          luxury and professional ease.
        </p>
      </Motion.div>

      <div className="commitment-grid">
        {points.map((point, index) => (
          <MotionLink
            key={point.title}
            to={point.to}
            className="commitment-card commitment-card-link"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.42, delay: index * 0.08 }}
            whileHover={{ y: -3 }}
          >
            <span className="commitment-icon" aria-hidden="true">
              *
            </span>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </MotionLink>
        ))}
      </div>
    </section>
  )
}

export default CommitmentSection
