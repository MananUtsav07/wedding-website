import { motion as Motion } from 'framer-motion'
import ProfessionalsSection from '../components/ProfessionalsSection'
import { professionals } from '../data/siteData'

function ProfessionalsPage() {
  return (
    <main className="page">
      <section className="section page-intro pros-hero-intro">
        <Motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Our Professional Photographers
        </Motion.h1>
        <Motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          Capture your love story with the finest cinematic and traditional wedding photographers in
          the region, handpicked for their artistic vision and technical excellence.
        </Motion.p>
      </section>
      <ProfessionalsSection professionals={professionals} />
    </main>
  )
}

export default ProfessionalsPage
