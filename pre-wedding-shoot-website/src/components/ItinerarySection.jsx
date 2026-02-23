import { motion as Motion } from 'framer-motion'

function ItinerarySection({ packages }) {
  return (
    <section className="section itinerary-section">
      <Motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <h2>Our Itinerary</h2>
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
          </Motion.article>
        ))}
      </div>
    </section>
  )
}

export default ItinerarySection
