import { useEffect } from 'react'
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
      <ItinerarySection packages={itineraryPackages} />
    </main>
  )
}

export default HomePage
