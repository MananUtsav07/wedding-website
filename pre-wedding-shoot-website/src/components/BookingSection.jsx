import { motion as Motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import samplePhoto from '../assets/fallback-photo.svg'

function getRecommendedProfessional(locationName, professionals) {
  const city = locationName.split(',')[0].trim().toLowerCase()
  return professionals.find((pro) => pro.city.toLowerCase() === city) ?? professionals[0]
}

function BookingSection({ locations, slotMap, professionals, onConfirm, initialLocation }) {
  const defaultLocation = locations.some((item) => item.name === initialLocation)
    ? initialLocation
    : locations[0].name

  const [form, setForm] = useState({
    partnerOne: '',
    partnerTwo: '',
    email: '',
    phone: '',
    location: defaultLocation,
    date: '',
    slot: slotMap[defaultLocation][0],
    photographer: 'recommended',
    packageType: 'Pre Wedding Shoot',
    paymentMethod: 'UPI',
    notes: '',
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
    <section className="section booking-shell">
      <form className="booking-layout" onSubmit={onSubmit}>
        <div className="booking-left">
          <Motion.section
            className="booking-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <h2>Select Your Date & Time</h2>
            <div className="booking-grid-two">
              <label>
                Preferred Date
                <input name="date" type="date" value={form.date} onChange={onChange} required />
              </label>

              <label>
                Destination
                <select name="location" value={form.location} onChange={onChange}>
                  {locations.map((place) => (
                    <option value={place.name} key={place.name}>
                      {place.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Assigned Photographer
              <select name="photographer" value={form.photographer} onChange={onChange}>
                <option value="recommended">Recommended (Auto Assign)</option>
                {professionals.map((pro) => (
                  <option value={pro.id} key={pro.id}>
                    {pro.name} - {pro.city}
                  </option>
                ))}
              </select>
            </label>

            <p className="recommendation-note">
              Recommended for this location: <strong>{recommendedProfessional.name}</strong>
            </p>

            <label className="slot-label">Available Sessions</label>
            <div className="slots">
              {availableSlots.map((slot) => (
                <Motion.button
                  key={slot}
                  type="button"
                  className={`slot-pill ${form.slot === slot ? 'active' : ''}`}
                  onClick={() => setForm((prev) => ({ ...prev, slot }))}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {slot}
                </Motion.button>
              ))}
            </div>
          </Motion.section>

          <Motion.section
            className="booking-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <h2>Couple Information</h2>
            <div className="booking-grid-two">
              <label>
                Partner 1 Full Name
                <input
                  name="partnerOne"
                  value={form.partnerOne}
                  onChange={onChange}
                  placeholder="Aarav Sharma"
                  required
                />
              </label>
              <label>
                Partner 2 Full Name
                <input
                  name="partnerTwo"
                  value={form.partnerTwo}
                  onChange={onChange}
                  placeholder="Simran Kaur"
                  required
                />
              </label>
              <label>
                Email Address
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="hello@couple.com"
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
            </div>

            <label>
              Special Requests or Vision
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows={4}
                placeholder="Tell us your story, moodboard preferences, and any specific frames."
              />
            </label>
          </Motion.section>

          <Motion.section
            className="booking-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <div className="booking-card-head">
              <h2>Selected Package</h2>
            </div>
            <div className="package-preview">
              <img src={samplePhoto} alt="Package preview" />
              <div>
                <h3>{form.packageType}</h3>
                <p>6 Hours • 2 Locations • 50 Edited Photos</p>
                <div className="package-badges">
                  <span>Most Popular</span>
                  <span>Save 15%</span>
                </div>
              </div>
            </div>
            <label>
              Choose Package
              <select name="packageType" value={form.packageType} onChange={onChange}>
                <option>Pre Wedding Shoot</option>
                <option>Wedding Shoot</option>
                <option>Post Wedding Shoot</option>
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
          </Motion.section>
        </div>

        <Motion.div
          className="booking-page-cta"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Motion.button type="submit" className="summary-cta" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            Continue to Payment
          </Motion.button>
        </Motion.div>
      </form>
    </section>
  )
}

export default BookingSection
