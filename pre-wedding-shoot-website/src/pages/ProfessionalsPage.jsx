import ProfessionalsSection from '../components/ProfessionalsSection'
import { professionals } from '../data/siteData'

function ProfessionalsPage() {
  return (
    <main className="page">
      <section className="section page-intro">
        <h1>Registered Professionals</h1>
        <p>
          Choose from verified photographers and production teams with proven pre-wedding portfolios.
        </p>
      </section>
      <ProfessionalsSection professionals={professionals} />
    </main>
  )
}

export default ProfessionalsPage
