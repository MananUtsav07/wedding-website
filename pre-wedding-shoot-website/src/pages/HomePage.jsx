import Hero from '../components/Hero'
import CommitmentSection from '../components/CommitmentSection'
import LocationsSection from '../components/LocationsSection'
import { locations } from '../data/siteData'

function HomePage() {
  return (
    <main className="page">
      <Hero />
      <CommitmentSection />
      <LocationsSection locations={locations} />
    </main>
  )
}

export default HomePage
