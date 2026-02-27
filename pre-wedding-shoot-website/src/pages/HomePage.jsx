import { useEffect } from 'react'
import CinematicStandardsSection from '../components/CinematicStandardsSection'
import CustomQuoteSection from '../components/CustomQuoteSection'
import Hero from '../components/Hero'
import CommitmentSection from '../components/CommitmentSection'
import ItinerarySection from '../components/ItinerarySection'
import { itinerarySharedSlides } from '../data/itinerarySlides'
import { itineraryPackages, locations } from '../data/siteData'

function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="page">
      <Hero />
      <CommitmentSection />
      <CinematicStandardsSection />
      <CustomQuoteSection locations={locations} />
      <ItinerarySection packages={itineraryPackages} sharedSlides={itinerarySharedSlides} />
    </main>
  )
}

export default HomePage
