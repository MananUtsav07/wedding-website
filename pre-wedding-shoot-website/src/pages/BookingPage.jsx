import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookingSection from '../components/BookingSection'
import ConfirmationSection from '../components/ConfirmationSection'
import { locations, professionals, slotMap } from '../data/siteData'

function BookingPage() {
  const [searchParams] = useSearchParams()
  const [confirmed, setConfirmed] = useState(null)
  const selectedLocation = searchParams.get('location') ?? ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="page">
      <BookingSection
        locations={locations}
        slotMap={slotMap}
        professionals={professionals}
        initialLocation={selectedLocation}
        onConfirm={setConfirmed}
      />
      {confirmed && <ConfirmationSection confirmed={confirmed} />}
    </main>
  )
}

export default BookingPage
