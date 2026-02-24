import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookingSection from '../components/BookingSection'
import ConfirmationSection from '../components/ConfirmationSection'
import { locations, professionals, slotMap } from '../data/siteData'

const BOOKINGS_STORAGE_KEY = 'pw_booking_history_v1'

function BookingPage() {
  const [searchParams] = useSearchParams()
  const [confirmed, setConfirmed] = useState(null)
  const selectedLocation = searchParams.get('location') ?? ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!confirmed) {
      return
    }

    let existing = []
    try {
      const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY)
      existing = raw ? JSON.parse(raw) : []
    } catch {
      existing = []
    }

    const next = [confirmed, ...existing].slice(0, 25)
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(next))
  }, [confirmed])

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
