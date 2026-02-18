function ConfirmationSection({ confirmed }) {
  return (
    <section className="section confirmation">
      <h2>Booking Draft Created</h2>
      <p>
        Booking ID: <strong>{confirmed.bookingId}</strong>
      </p>
      <p>
        {confirmed.coupleName} selected {confirmed.location} on {confirmed.date || 'selected date'} at{' '}
        {confirmed.slot}. Payment method preference: {confirmed.paymentMethod}.
      </p>
      <p>Photographer: {confirmed.selectedProfessional || 'Recommended (auto assign)'}</p>
    </section>
  )
}

export default ConfirmationSection
