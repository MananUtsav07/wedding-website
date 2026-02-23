import { motion as Motion } from 'framer-motion'

function ConfirmationSection({ confirmed }) {
  return (
    <Motion.section
      className="section confirmation"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
    >
      <h2>Booking Draft Created</h2>
      <p>
        Booking ID: <strong>{confirmed.bookingId}</strong>
      </p>
      <p>
        {confirmed.coupleName} selected {confirmed.location} on {confirmed.date || 'selected date'} at{' '}
        {confirmed.slot}. Payment method preference: {confirmed.paymentMethod}.
      </p>
      <p>Photographer: {confirmed.selectedProfessional || 'Recommended (auto assign)'}</p>
    </Motion.section>
  )
}

export default ConfirmationSection
