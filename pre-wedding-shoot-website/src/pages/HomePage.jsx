import { useEffect } from 'react'
import CinematicStandardsSection from '../components/CinematicStandardsSection'
import Hero from '../components/Hero'
import CommitmentSection from '../components/CommitmentSection'
import ItinerarySection from '../components/ItinerarySection'
import { itineraryPackages } from '../data/siteData'

function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="page">
      <Hero />
      <CommitmentSection />
      <CinematicStandardsSection />
      <ItinerarySection packages={itineraryPackages} />
    </main>
  )
}

export default HomePage
