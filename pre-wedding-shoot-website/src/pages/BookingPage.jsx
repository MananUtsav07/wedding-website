import { useState } from 'react'
import BookingSection from '../components/BookingSection'
import ConfirmationSection from '../components/ConfirmationSection'
import { locations, professionals, slotMap } from '../data/siteData'

function BookingPage() {
  const [confirmed, setConfirmed] = useState(null)

  return (
    <main className="page">
      <section className="section page-intro">
        <h1>Book a Shoot Slot</h1>
        <p>Pick your location, date, and package. Next step is payment gateway integration.</p>
      </section>
      <BookingSection
        locations={locations}
        slotMap={slotMap}
        professionals={professionals}
        onConfirm={setConfirmed}
      />
      {confirmed && <ConfirmationSection confirmed={confirmed} />}
    </main>
  )
}

export default BookingPage
