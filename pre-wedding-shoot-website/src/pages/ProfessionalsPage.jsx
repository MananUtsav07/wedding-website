import ProfessionalsSection from '../components/ProfessionalsSection'
import { professionals } from '../data/siteData'

function ProfessionalsPage() {
  return (
    <main className="page">
      <section className="section page-intro pros-hero-intro">
        <h1>Our Professional Photographers</h1>
        <p>
          Capture your love story with the finest cinematic and traditional wedding photographers in
          the region, handpicked for their artistic vision and technical excellence.
        </p>
      </section>
      <ProfessionalsSection professionals={professionals} />
    </main>
  )
}

export default ProfessionalsPage
