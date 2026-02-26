import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { getCurrentSession } from '../utils/authStorage'

const TIME_SLOT_OPTIONS = [
  { id: 'morning-glow', label: 'Morning Glow', time: '9:00 AM - 12:00 PM' },
  { id: 'high-noon', label: 'High Noon', time: '12:00 PM - 3:00 PM' },
  { id: 'evening-softness', label: 'Evening Softness', time: '3:00 PM - 5:00 PM' },
  { id: 'sunset-gold', label: 'Sunset Gold', time: '5:00 PM - 7:00 PM' },
]

const DELIVERABLE_OPTIONS = [
  { id: 'still-imagery', label: 'Images' },
  { id: 'cinematic-video', label: 'Cinematic Video' },
  { id: 'hybrid-coverage', label: 'Images + Video' },
]

function normalizeLocation(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function hasLocation(list, value) {
  const next = normalizeLocation(value).toLowerCase()
  return list.some((item) => item.toLowerCase() === next)
}

function CustomQuoteSection({ locations }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [preferredLocations, setPreferredLocations] = useState([])
  const [locationInput, setLocationInput] = useState('')
  const [isLocationFocused, setIsLocationFocused] = useState(false)
  const [locationPlaceholder, setLocationPlaceholder] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [deliverable, setDeliverable] = useState('')
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  const locationNames = useMemo(() => locations.map((location) => location.name), [locations])
  const locationExamples = useMemo(
    () =>
      locationNames.length
        ? locationNames.slice(0, 6)
        : ['Patnitop, Jammu & Kashmir', 'Dal Lake, Srinagar', 'Shimla, Himachal Pradesh'],
    [locationNames],
  )

  const suggestions = useMemo(() => {
    const query = normalizeLocation(locationInput).toLowerCase()
    if (!query) {
      return []
    }

    const startsWithQuery = locationNames.filter((locationName) =>
      locationName.toLowerCase().startsWith(query),
    )
    const includesQuery = locationNames.filter(
      (locationName) =>
        !locationName.toLowerCase().startsWith(query) && locationName.toLowerCase().includes(query),
    )
    return [...startsWithQuery, ...includesQuery].slice(0, 8)
  }, [locationInput, locationNames])

  useEffect(() => {
    if (!isDialogOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDialogOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isDialogOpen])

  useEffect(() => {
    if (!isDialogOpen || normalizeLocation(locationInput)) {
      return undefined
    }

    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timerId = 0

    const tick = () => {
      const phrase = locationExamples[phraseIndex]

      if (deleting) {
        charIndex -= 1
      } else {
        charIndex += 1
      }

      setLocationPlaceholder(phrase.slice(0, charIndex))

      let speed = deleting ? 45 : 90
      if (!deleting && charIndex === phrase.length) {
        deleting = true
        speed = 80
      } else if (deleting && charIndex === 0) {
        deleting = false
        phraseIndex = (phraseIndex + 1) % locationExamples.length
        speed = 260
      }

      timerId = window.setTimeout(tick, speed)
    }

    timerId = window.setTimeout(tick, 180)
    return () => window.clearTimeout(timerId)
  }, [isDialogOpen, locationInput, locationExamples])

  const addPreferredLocation = (value) => {
    const next = normalizeLocation(value)
    if (!next) {
      return
    }

    setPreferredLocations((prev) => {
      if (hasLocation(prev, next)) {
        return prev
      }
      return [...prev, next]
    })
    setLocationInput('')
    setFeedback({ type: '', text: '' })
  }

  const removePreferredLocation = (targetLocation) => {
    setPreferredLocations((prev) => prev.filter((location) => location !== targetLocation))
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const session = getCurrentSession()

    if (!session) {
      setFeedback({ type: 'error', text: 'Please log in first to generate a custom quote.' })
      window.alert('Please log in first.')
      return
    }

    const typedLocation = normalizeLocation(locationInput)
    const pickedLocations = [...preferredLocations]

    if (typedLocation && !hasLocation(pickedLocations, typedLocation)) {
      pickedLocations.push(typedLocation)
      setPreferredLocations(pickedLocations)
      setLocationInput('')
    }

    if (!pickedLocations.length) {
      setFeedback({ type: 'error', text: 'Please add at least one preferred location.' })
      return
    }
    if (!targetDate) {
      setFeedback({ type: 'error', text: 'Please select a target date.' })
      return
    }
    if (!timeSlot) {
      setFeedback({ type: 'error', text: 'Please select one preferred timeslot.' })
      return
    }
    if (!deliverable) {
      setFeedback({ type: 'error', text: 'Please choose one required deliverable.' })
      return
    }

    setFeedback({
      type: 'success',
      text: 'Your custom quote brief is ready. Our team will contact you with a personalized plan.',
    })
  }

  return (
    <section className="section custom-quote-section">
      <div className="custom-quote-inner">
        <Motion.div
          className="custom-quote-trigger"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <p>
            Can&apos;t find exactly what you&apos;re looking for? Create a personalized package tailored to your
            unique vision and schedule.
          </p>
          <button type="button" className="custom-quote-trigger-btn" onClick={() => setIsDialogOpen(true)}>
            Design Your Dream Shoot
          </button>
        </Motion.div>

        <AnimatePresence>
          {isDialogOpen ? (
            <Motion.div
              className="custom-quote-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDialog}
            >
              <Motion.div
                className="custom-quote-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="custom-quote-title"
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="custom-quote-modal-head">
                  <button type="button" className="custom-quote-back-btn" onClick={closeDialog}>
                    Back
                  </button>
                </div>

                <div className="custom-quote-header custom-quote-header-compact" id="custom-quote-form">
                  <div>
                    <h2 id="custom-quote-title">Design Your Dream Shoot</h2>
                  </div>
                </div>

                <form className="custom-quote-card" onSubmit={onSubmit}>
                  <div className="custom-quote-row">
                    <div className="custom-quote-input-group custom-quote-location-group">
                      <label>Preferred Location</label>
                      <div className="custom-quote-custom-row custom-quote-search-row">
                        <div className="custom-quote-location-autocomplete">
                          <input
                            type="text"
                            className="custom-quote-location-input"
                            value={locationInput}
                            onChange={(event) => setLocationInput(event.target.value)}
                            onFocus={() => setIsLocationFocused(true)}
                            onBlur={() => window.setTimeout(() => setIsLocationFocused(false), 120)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                addPreferredLocation(locationInput)
                              }
                            }}
                            placeholder={
                              locationPlaceholder
                                ? `e.g. ${locationPlaceholder}`
                                : 'e.g.'
                            }
                          />
                          {isLocationFocused && normalizeLocation(locationInput).length > 0 && suggestions.length ? (
                            <ul className="custom-quote-suggestions">
                              {suggestions.map((locationName) => (
                                <li key={locationName}>
                                  <button
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => addPreferredLocation(locationName)}
                                  >
                                    {locationName}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>

                      <div className="custom-quote-picked">
                        {preferredLocations.length
                          ? (
                          preferredLocations.map((locationName) => (
                            <span key={locationName}>
                              {locationName}
                              <button
                                type="button"
                                onClick={() => removePreferredLocation(locationName)}
                                aria-label={`Remove ${locationName}`}
                              >
                                x
                              </button>
                            </span>
                          ))
                          )
                          : null}
                      </div>
                    </div>

                    <div className="custom-quote-input-group custom-quote-date-group">
                      <label>Target Date</label>
                      <input
                        type="date"
                        className="custom-quote-date-input"
                        value={targetDate}
                        onChange={(event) => setTargetDate(event.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="custom-quote-selector-group">
                    <label>Preferred Timeslot</label>
                    <div className="custom-quote-tile-grid">
                      {TIME_SLOT_OPTIONS.map((slot) => (
                        <label className="custom-quote-choice" key={slot.id}>
                          <input
                            type="radio"
                            name="preferred-timeslot"
                            checked={timeSlot === slot.id}
                            onChange={() => setTimeSlot(slot.id)}
                          />
                          <span>
                            <strong>{slot.label}</strong>
                            <small>{slot.time}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="custom-quote-selector-group">
                    <label>Required Deliverables</label>
                    <div className="custom-quote-tile-grid">
                      {DELIVERABLE_OPTIONS.map((item) => (
                        <label className="custom-quote-choice" key={item.id}>
                          <input
                            type="radio"
                            name="required-deliverable"
                            checked={deliverable === item.id}
                            onChange={() => setDeliverable(item.id)}
                          />
                          <span>
                            <strong>{item.label}</strong>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="custom-quote-footer">
                    {feedback.text ? (
                      <p
                        className={
                          feedback.type === 'error'
                            ? 'custom-quote-feedback error'
                            : 'custom-quote-feedback success'
                        }
                      >
                        {feedback.text}
                      </p>
                    ) : null}
                    <button className="custom-quote-submit" type="submit">
                      Generate My Custom Quote
                    </button>
                  </div>
                </form>
              </Motion.div>
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default CustomQuoteSection
