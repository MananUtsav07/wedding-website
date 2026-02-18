import { useMemo, useState } from 'react'

function getRecommendedProfessional(locationName, professionals) {
  const city = locationName.split(',')[0].trim().toLowerCase()
  return professionals.find((pro) => pro.city.toLowerCase() === city) ?? professionals[0]
}

function BookingSection({ locations, slotMap, professionals, onConfirm }) {
  const [form, setForm] = useState({
    coupleName: '',
    phone: '',
    location: locations[0].name,
    date: '',
    slot: slotMap[locations[0].name][0],
    photographer: 'recommended',
    packageType: 'Classic Photo',
    paymentMethod: 'UPI',
  })

  const availableSlots = useMemo(() => slotMap[form.location] ?? [], [form.location, slotMap])
  const recommendedProfessional = useMemo(
    () => getRecommendedProfessional(form.location, professionals),
    [form.location, professionals],
  )

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => {
      if (name === 'location') {
        return { ...prev, location: value, slot: slotMap[value][0] }
      }
      return { ...prev, [name]: value }
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const selectedProfessional =
      form.photographer === 'recommended'
        ? recommendedProfessional.name
        : professionals.find((pro) => pro.id === form.photographer)?.name || 'Not selected'

    onConfirm({
      ...form,
      selectedProfessional,
      bookingId: `PW-${Date.now().toString().slice(-6)}`,
    })
  }

  return (
    <section className="section booking-wrap">
      <div>
        <h2>Book Your Pre-Wedding Slot</h2>
        <p className="helper">
          Select your preferred destination and time slot. Payment integration can be connected to
          Razorpay, Stripe, or another gateway in the next phase.
        </p>
        <p className="recommendation-note">
          Recommended for this location: <strong>{recommendedProfessional.name}</strong>
        </p>
        <div className="slots">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              className={`slot-pill ${form.slot === slot ? 'active' : ''}`}
              onClick={() => setForm((prev) => ({ ...prev, slot }))}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <form className="booking-form" onSubmit={onSubmit}>
        <label>
          Couple Name
          <input
            name="coupleName"
            value={form.coupleName}
            onChange={onChange}
            placeholder="Aarav & Simran"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+91 98XXXXXX12"
            required
          />
        </label>

        <label>
          Location
          <select name="location" value={form.location} onChange={onChange}>
            {locations.map((place) => (
              <option value={place.name} key={place.name}>
                {place.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Shoot Date
          <input name="date" type="date" value={form.date} onChange={onChange} required />
        </label>

        <label>
          Photographer
          <select name="photographer" value={form.photographer} onChange={onChange}>
            <option value="recommended">Recommended (Auto Assign)</option>
            {professionals.map((pro) => (
              <option value={pro.id} key={pro.id}>
                {pro.name} - {pro.city}
              </option>
            ))}
          </select>
        </label>

        <label>
          Package
          <select name="packageType" value={form.packageType} onChange={onChange}>
            <option>Classic Photo</option>
            <option>Photo + Reel</option>
            <option>Cinematic Film</option>
          </select>
        </label>

        <label>
          Payment Mode
          <select name="paymentMethod" value={form.paymentMethod} onChange={onChange}>
            <option>UPI</option>
            <option>Card</option>
            <option>Net Banking</option>
          </select>
        </label>

        <button type="submit">Reserve Slot & Continue to Payment</button>
      </form>
    </section>
  )
}

export default BookingSection
