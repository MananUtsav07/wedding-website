import { motion as Motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const STANDARD_TIME_SLOTS = [
  { id: 'morning-glow', label: 'Morning Glow', time: '9:00 AM - 12:00 PM' },
  { id: 'high-noon', label: 'High Noon', time: '12:00 PM - 3:00 PM' },
  { id: 'evening-softness', label: 'Evening Softness', time: '3:00 PM - 5:00 PM' },
  { id: 'sunset-gold', label: 'Sunset Gold', time: '5:00 PM - 7:00 PM' },
]
const MAX_BOOKING_DAYS = 5

const PACKAGE_MAP = {
  'pre-wedding': {
    title: 'Pre Wedding Shoot',
    meta: '6 Hours • 2 Locations • 50 Edited Photos',
    color: 'linear-gradient(135deg, #fed7aa, #fb923c)',
    badges: ['Most Popular', 'Save 15%'],
  },
  wedding: {
    title: 'Wedding Shoot',
    meta: '12 Hours • Full Day • 200+ Edited Photos',
    color: 'linear-gradient(135deg, #dbeafe, #3b82f6)',
    badges: ['Best Value', 'Full Coverage'],
  },
  'post-wedding': {
    title: 'Post Wedding Shoot',
    meta: '4 Hours • 1 Location • 35 Edited Photos',
    color: 'linear-gradient(135deg, #fde68a, #f59e0b)',
    badges: ['Cinematic', 'Story Edit'],
  },
  'other-events': {
    title: 'Other Events',
    meta: 'Describe your event below for a custom quote',
    color: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
    badges: ['Custom', 'Quote Based'],
  },
}

const OTHER_EVENT_PLACEHOLDERS = [
  'Engagement celebration...',
  'Retirement function...',
  'Mundan ceremony...',
  'Anniversary event...',
]

function clampBookingDays(value) {
  return Math.min(MAX_BOOKING_DAYS, Math.max(1, Number(value) || 1))
}

function addDaysToIsoDate(dateValue, offset) {
  if (!dateValue) {
    return ''
  }

  const parts = dateValue.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return ''
  }

  const date = new Date(parts[0], parts[1] - 1, parts[2])
  date.setDate(date.getDate() + offset)

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function createDayPlan(baseLocation, baseDate = '', baseSlot = STANDARD_TIME_SLOTS[0].id, dayOffset = 0) {
  return {
    date: addDaysToIsoDate(baseDate, dayOffset),
    location: baseLocation,
    slot: baseSlot,
  }
}

function getRecommendedProfessional(locationName, professionals) {
  const safeLocationName = typeof locationName === 'string' ? locationName : ''
  const city = safeLocationName.split(',')[0].trim().toLowerCase()
  return professionals.find((pro) => pro.city.toLowerCase() === city) ?? professionals[0]
}

function BookingSection({ locations, professionals, onConfirm, initialLocation }) {
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
    slot: STANDARD_TIME_SLOTS[0].id,
    photographer: 'recommended',
    packageType: 'pre-wedding',
    otherEventDescription: '',
    paymentMethod: 'UPI',
    notes: '',
  })
  const [shootDays, setShootDays] = useState(1)
  const [useSameOptions, setUseSameOptions] = useState(true)
  const [dayPlans, setDayPlans] = useState(() => [createDayPlan(defaultLocation)])
  const [otherTypingPlaceholder, setOtherTypingPlaceholder] = useState('')
  const primaryDayPlan = dayPlans[0] ?? createDayPlan(defaultLocation)

  const selectedPackage = useMemo(() => PACKAGE_MAP[form.packageType] ?? PACKAGE_MAP['pre-wedding'], [form.packageType])
  const selectedTimeSlot = useMemo(
    () => STANDARD_TIME_SLOTS.find((slot) => slot.id === primaryDayPlan.slot) ?? STANDARD_TIME_SLOTS[0],
    [primaryDayPlan.slot],
  )
  const recommendedProfessional = useMemo(
    () => getRecommendedProfessional(primaryDayPlan.location, professionals),
    [primaryDayPlan.location, professionals],
  )

  useEffect(() => {
    if (form.packageType !== 'other-events') {
      return undefined
    }

    let wordIndex = 0
    let charIndex = 0
    let deleting = false
    let timerId = 0

    const tick = () => {
      const currentWord = OTHER_EVENT_PLACEHOLDERS[wordIndex]
      if (!deleting) {
        charIndex += 1
      } else {
        charIndex -= 1
      }

      setOtherTypingPlaceholder(currentWord.slice(0, charIndex))

      let speed = deleting ? 50 : 95

      if (!deleting && charIndex === currentWord.length) {
        deleting = true
        speed = 1000
      } else if (deleting && charIndex === 0) {
        deleting = false
        wordIndex = (wordIndex + 1) % OTHER_EVENT_PLACEHOLDERS.length
        speed = 280
      }

      timerId = window.setTimeout(tick, speed)
    }

    timerId = window.setTimeout(tick, 220)
    return () => window.clearTimeout(timerId)
  }, [form.packageType])

  useEffect(() => {
    setDayPlans((prev) => {
      if (shootDays === prev.length) {
        return prev
      }

      if (shootDays < prev.length) {
        return prev.slice(0, shootDays)
      }

      const dayOne = prev[0] ?? createDayPlan(defaultLocation)
      const next = [...prev]
      for (let i = prev.length; i < shootDays; i += 1) {
        next.push(createDayPlan(dayOne.location, dayOne.date, dayOne.slot, i))
      }
      return next
    })
  }, [shootDays, defaultLocation])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => {
      if (name === 'packageType') {
        return {
          ...prev,
          packageType: value,
          otherEventDescription: value === 'other-events' ? prev.otherEventDescription : '',
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const setDayDate = (dayIndex, value) => {
    setDayPlans((prev) => {
      const next = prev.map((day) => ({ ...day }))
      const previousPrimaryDate = prev[0]?.date || ''

      next[dayIndex].date = value

      if (dayIndex === 0) {
        for (let i = 1; i < next.length; i += 1) {
          const previousAutoDate = addDaysToIsoDate(previousPrimaryDate, i)
          if (!next[i].date || next[i].date === previousAutoDate) {
            next[i].date = addDaysToIsoDate(value, i)
          }
        }
      }

      return next
    })

    if (dayIndex === 0) {
      setForm((prev) => ({ ...prev, date: value }))
    }
  }

  const setDayLocation = (dayIndex, value) => {
    setDayPlans((prev) => {
      const next = prev.map((day) => ({ ...day }))
      const previousPrimaryLocation = prev[0]?.location || defaultLocation
      next[dayIndex].location = value

      if (dayIndex === 0) {
        for (let i = 1; i < next.length; i += 1) {
          if (useSameOptions || !next[i].location || next[i].location === previousPrimaryLocation) {
            next[i].location = value
          }
        }
      }

      return next
    })

    if (dayIndex === 0) {
      setForm((prev) => ({ ...prev, location: value }))
    }
  }

  const setDaySlot = (dayIndex, value) => {
    setDayPlans((prev) => {
      const next = prev.map((day) => ({ ...day }))
      next[dayIndex].slot = value

      if (dayIndex === 0 && useSameOptions) {
        for (let i = 1; i < next.length; i += 1) {
          next[i].slot = value
        }
      }

      return next
    })

    if (dayIndex === 0) {
      setForm((prev) => ({ ...prev, slot: value }))
    }
  }

  const onShootDaysChange = (event) => {
    const nextShootDays = clampBookingDays(event.target.value)
    setShootDays(nextShootDays)
    if (nextShootDays === 1) {
      setUseSameOptions(true)
    }
  }

  const onToggleSameOptions = (event) => {
    const checked = event.target.checked
    setUseSameOptions(checked)

    if (!checked) {
      return
    }

    setDayPlans((prev) => {
      const dayOne = prev[0] ?? createDayPlan(defaultLocation)
      return prev.map((day, index) => {
        if (index === 0) {
          return day
        }
        return {
          ...day,
          location: dayOne.location,
          slot: dayOne.slot,
          date: day.date || addDaysToIsoDate(dayOne.date, index),
        }
      })
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const selectedProfessional =
      form.photographer === 'recommended'
        ? recommendedProfessional.name
        : professionals.find((pro) => pro.id === form.photographer)?.name || 'Not selected'

    const primaryDate = dayPlans[0]?.date || ''
    const primaryLocation = dayPlans[0]?.location || defaultLocation
    const primarySlot = dayPlans[0]?.slot || STANDARD_TIME_SLOTS[0].id
    const finalizedDayPlans = dayPlans.slice(0, shootDays).map((day, index) => {
      const slotId = useSameOptions ? primarySlot : day.slot || primarySlot
      const slotMeta = STANDARD_TIME_SLOTS.find((slot) => slot.id === slotId) ?? STANDARD_TIME_SLOTS[0]
      return {
        date: day.date || addDaysToIsoDate(primaryDate, index),
        location: useSameOptions ? primaryLocation : day.location || primaryLocation,
        slotId,
        slot: `${slotMeta.label} (${slotMeta.time})`,
      }
    })

    const firstDay = finalizedDayPlans[0]

    onConfirm({
      ...form,
      location: firstDay.location,
      date: firstDay.date,
      slot: firstDay.slot,
      shootDays,
      sameOptionsForAllDates: useSameOptions,
      dayPlans: finalizedDayPlans,
      coupleName: `${form.partnerOne} & ${form.partnerTwo}`,
      packageType: selectedPackage.title,
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
                <input type="date" value={primaryDayPlan.date} onChange={(event) => setDayDate(0, event.target.value)} required />
              </label>

              <label>
                Destination
                <select value={primaryDayPlan.location} onChange={(event) => setDayLocation(0, event.target.value)}>
                  {locations.map((place) => (
                    <option value={place.name} key={place.name}>
                      {place.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="booking-date-options">
              <label className="booking-duration-field">
                Number of dates
                <select value={shootDays} onChange={onShootDaysChange}>
                  {Array.from({ length: MAX_BOOKING_DAYS }, (_, index) => index + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className={`booking-sync-field ${shootDays === 1 ? 'disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={useSameOptions || shootDays === 1}
                  onChange={onToggleSameOptions}
                  disabled={shootDays === 1}
                />
                Use same destination and session for all dates
              </label>
            </div>

            {shootDays > 1 && useSameOptions ? (
              <p className="booking-sync-note">
                Day 2 to Day {shootDays} will carry forward destination and date sequence from Day 1.
              </p>
            ) : null}

            <label className="slot-label">{shootDays > 1 && !useSameOptions ? 'Day 1 Sessions' : 'Available Sessions'}</label>
            <div className="slots">
              {STANDARD_TIME_SLOTS.map((slot) => (
                <Motion.button
                  key={slot.id}
                  type="button"
                  className={`slot-pill ${primaryDayPlan.slot === slot.id ? 'active' : ''}`}
                  onClick={() => setDaySlot(0, slot.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="slot-title">{slot.label}</span>
                  <span className="slot-time">{slot.time}</span>
                </Motion.button>
              ))}
            </div>

            {shootDays > 1 && !useSameOptions ? (
              <div className="booking-multi-day-stack">
                {dayPlans.slice(1, shootDays).map((dayPlan, extraIndex) => {
                  const dayIndex = extraIndex + 1
                  return (
                    <div className="booking-day-card" key={`booking-day-${dayIndex + 1}`}>
                      <h3>Day {dayIndex + 1}</h3>
                      <div className="booking-grid-two">
                        <label>
                          Preferred Date
                          <input
                            type="date"
                            value={dayPlan.date}
                            onChange={(event) => setDayDate(dayIndex, event.target.value)}
                            required
                          />
                        </label>

                        <label>
                          Destination
                          <select value={dayPlan.location} onChange={(event) => setDayLocation(dayIndex, event.target.value)}>
                            {locations.map((place) => (
                              <option value={place.name} key={`${place.id}-${dayIndex}`}>
                                {place.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label className="slot-label">Available Sessions</label>
                      <div className="slots">
                        {STANDARD_TIME_SLOTS.map((slot) => (
                          <Motion.button
                            key={`${slot.id}-${dayIndex}`}
                            type="button"
                            className={`slot-pill ${dayPlan.slot === slot.id ? 'active' : ''}`}
                            onClick={() => setDaySlot(dayIndex, slot.id)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="slot-title">{slot.label}</span>
                            <span className="slot-time">{slot.time}</span>
                          </Motion.button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}

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
              <div className="package-preview-thumb" style={{ background: selectedPackage.color }} aria-hidden="true" />
              <div>
                <h3>{selectedPackage.title}</h3>
                <p>{selectedPackage.meta}</p>
                <div className="package-badges">
                  {selectedPackage.badges.map((badge) => (
                    <span key={badge}>{badge}</span>
                  ))}
                </div>
              </div>
            </div>
            <label>
              Choose Package
              <select name="packageType" value={form.packageType} onChange={onChange}>
                <option value="pre-wedding">Pre Wedding Shoot</option>
                <option value="wedding">Wedding Shoot</option>
                <option value="other-events">Other Events</option>
              </select>
            </label>
            {form.packageType === 'other-events' ? (
              <label className="other-event-field">
                Event Description
                <input
                  name="otherEventDescription"
                  value={form.otherEventDescription}
                  onChange={onChange}
                  placeholder={otherTypingPlaceholder || 'Describe your event...'}
                />
              </label>
            ) : null}
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
