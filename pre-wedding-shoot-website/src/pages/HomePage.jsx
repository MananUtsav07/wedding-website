import Hero from '../components/Hero'
import LocationsSection from '../components/LocationsSection'
import { locations } from '../data/siteData'

function HomePage() {
  return (
    <main className="page">
      <Hero />
      <LocationsSection locations={locations} />
    </main>
  )
}

export default HomePage
