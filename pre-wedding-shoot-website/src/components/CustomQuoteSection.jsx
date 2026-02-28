import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getCurrentSession } from '../utils/authStorage'

const MAX_SHOOT_DAYS = 5
const TIME_SLOT_OPTIONS = [
  { id: 'morning-glow', label: 'Morning Glow', time: '9:00 AM - 12:00 PM' },
  { id: 'high-noon', label: 'High Noon', time: '12:00 PM - 3:00 PM' },
  { id: 'evening-softness', label: 'Evening Softness', time: '3:00 PM - 5:00 PM' },
  { id: 'sunset-gold', label: 'Sunset Gold', time: '5:00 PM - 7:00 PM' },
]

const DELIVERABLE_OPTIONS = [
  { id: 'still-imagery', label: 'Still Images' },
  { id: 'cinematic-video', label: 'Cinematic Video' },
  { id: 'hybrid-coverage', label: 'Images + Video' },
]

const PENDING_CUSTOM_QUOTE_KEY = 'pw_pending_custom_quote_v1'

function normalizeLocation(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function hasLocation(list, value) {
  const next = normalizeLocation(value).toLowerCase()
  return list.some((item) => item.toLowerCase() === next)
}

function clampShootDays(value) {
  return Math.min(MAX_SHOOT_DAYS, Math.max(1, Number(value) || 1))
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

function createDayForm(baseLocations = [], baseDate = '', dayOffset = 0) {
  const initialInput = baseLocations.length ? baseLocations[0] : ''
  return {
    preferredLocations: [...baseLocations],
    locationInput: initialInput,
    isLocationFocused: false,
    targetDate: addDaysToIsoDate(baseDate, dayOffset),
    timeSlot: '',
    deliverable: '',
  }
}

function sanitizeDayForm(day) {
  const preferredLocations = Array.isArray(day?.preferredLocations)
    ? day.preferredLocations.map((value) => normalizeLocation(String(value))).filter(Boolean)
    : []
  const initialInput =
    typeof day?.locationInput === 'string' && day.locationInput
      ? day.locationInput
      : preferredLocations[0] || ''

  return {
    preferredLocations,
    locationInput: initialInput,
    isLocationFocused: false,
    targetDate: typeof day?.targetDate === 'string' ? day.targetDate : '',
    timeSlot: typeof day?.timeSlot === 'string' ? day.timeSlot : '',
    deliverable: typeof day?.deliverable === 'string' ? day.deliverable : '',
  }
}

function CustomQuoteSection({ locations }) {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false)
  const [shootDays, setShootDays] = useState(1)
  const [dayForms, setDayForms] = useState(() => [createDayForm()])
  const [locationPlaceholder, setLocationPlaceholder] = useState('')
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  const locationNames = useMemo(() => locations.map((location) => location.name), [locations])
  const locationExamples = useMemo(
    () =>
      locationNames.length
        ? locationNames.slice(0, 6)
        : ['Patnitop, Jammu', 'Dal Lake, Srinagar', 'Shimla, Himachal Pradesh'],
    [locationNames],
  )

  const getLocationSuggestions = (rawInput) => {
    const query = normalizeLocation(rawInput).toLowerCase()
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
  }

  useEffect(() => {
    if (!isDialogOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (isLoginPromptOpen) {
          setIsLoginPromptOpen(false)
          return
        }
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
  }, [isDialogOpen, isLoginPromptOpen])

  useEffect(() => {
    if (!isDialogOpen) {
      return undefined
    }

    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timerId = 0

    const tick = () => {
      const phrase = locationExamples[phraseIndex]

      charIndex = deleting ? charIndex - 1 : charIndex + 1
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
  }, [isDialogOpen, locationExamples])

  useEffect(() => {
    const raw = window.sessionStorage.getItem(PENDING_CUSTOM_QUOTE_KEY)
    if (!raw) {
      return
    }

    try {
      const saved = JSON.parse(raw)
      const savedDays = clampShootDays(saved?.shootDays || saved?.dayForms?.length || 1)

      if (Array.isArray(saved?.dayForms) && saved.dayForms.length) {
        const sanitized = saved.dayForms.map((day) => sanitizeDayForm(day))
        const primaryDate = sanitized[0]?.targetDate || ''
        const primaryLocations = sanitized[0]?.preferredLocations || []

        let nextDayForms = sanitized.slice(0, savedDays)
        for (let i = nextDayForms.length; i < savedDays; i += 1) {
          nextDayForms.push(createDayForm(primaryLocations, primaryDate, i))
        }

        setShootDays(savedDays)
        setDayForms(nextDayForms)
      } else {
        // Backward compatibility with previous single-day saved payload.
        const fallback = sanitizeDayForm(saved)
        setShootDays(1)
        setDayForms([fallback])
      }

      if (saved?.openDialog) {
        setIsDialogOpen(true)
      }
    } catch {
      // Ignore invalid session payload and continue.
    } finally {
      window.sessionStorage.removeItem(PENDING_CUSTOM_QUOTE_KEY)
    }
  }, [])

  useEffect(() => {
    setDayForms((prev) => {
      if (shootDays === prev.length) {
        return prev
      }

      if (shootDays < prev.length) {
        return prev.slice(0, shootDays)
      }

      const dayOne = prev[0] || createDayForm()
      const next = [...prev]
      for (let i = prev.length; i < shootDays; i += 1) {
        next.push(createDayForm(dayOne.preferredLocations, dayOne.targetDate, i))
      }
      return next
    })
  }, [shootDays])

  const updateDayForm = (dayIndex, updater) => {
    setDayForms((prev) =>
      prev.map((day, index) => {
        if (index !== dayIndex) {
          return day
        }
        const nextDay = typeof updater === 'function' ? updater(day) : updater
        return { ...day, ...nextDay }
      }),
    )
  }

  const setDayTargetDate = (dayIndex, value) => {
    setDayForms((prev) => {
      const next = prev.map((day) => ({ ...day }))
      const previousPrimaryDate = prev[0]?.targetDate || ''
      next[dayIndex].targetDate = value

      if (dayIndex === 0) {
        for (let i = 1; i < next.length; i += 1) {
          const previousAutoValue = addDaysToIsoDate(previousPrimaryDate, i)
          if (!next[i].targetDate || next[i].targetDate === previousAutoValue) {
            next[i].targetDate = addDaysToIsoDate(value, i)
          }
        }
      }

      return next
    })
  }

  const addPreferredLocation = (dayIndex, value) => {
    const next = normalizeLocation(value)
    if (!next) {
      return
    }

    updateDayForm(dayIndex, (day) => {
      if (hasLocation(day.preferredLocations, next)) {
        return { locationInput: next }
      }

      return {
        preferredLocations: [...day.preferredLocations, next],
        locationInput: next,
      }
    })

    setFeedback({ type: '', text: '' })
  }

  const closeDialog = () => {
    setIsLoginPromptOpen(false)
    setIsDialogOpen(false)
  }

  const continueToLogin = () => {
    setIsLoginPromptOpen(false)
    navigate('/login', { state: { redirectTo: '/' } })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const session = getCurrentSession()

    if (!session) {
      window.sessionStorage.setItem(
        PENDING_CUSTOM_QUOTE_KEY,
        JSON.stringify({
          shootDays,
          dayForms,
          openDialog: true,
        }),
      )
      setFeedback({ type: '', text: '' })
      setIsLoginPromptOpen(true)
      return
    }

    const finalizedDays = dayForms.map((day) => {
      const typedLocation = normalizeLocation(day.locationInput)
      const preferredLocations = [...day.preferredLocations]

      if (typedLocation && !hasLocation(preferredLocations, typedLocation)) {
        preferredLocations.push(typedLocation)
      }

      return {
        ...day,
        preferredLocations,
        locationInput: typedLocation || day.locationInput || preferredLocations[0] || '',
      }
    })

    for (let i = 0; i < finalizedDays.length; i += 1) {
      const dayLabel = `Day ${i + 1}`
      const day = finalizedDays[i]

      if (!day.preferredLocations.length) {
        setFeedback({ type: 'error', text: `Please add at least one preferred location for ${dayLabel}.` })
        return
      }

      if (!day.targetDate) {
        setFeedback({ type: 'error', text: `Please select a target date for ${dayLabel}.` })
        return
      }

      if (!day.timeSlot) {
        setFeedback({ type: 'error', text: `Please select one preferred timeslot for ${dayLabel}.` })
        return
      }

      if (!day.deliverable) {
        setFeedback({ type: 'error', text: `Please choose one required deliverable for ${dayLabel}.` })
        return
      }
    }

    setDayForms(finalizedDays)
    setFeedback({
      type: 'success',
      text: 'Your custom quote brief is ready. Our team will contact you with a personalized plan.',
    })
    window.sessionStorage.removeItem(PENDING_CUSTOM_QUOTE_KEY)
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
                  {dayForms.map((day, dayIndex) => {
                    const suggestions = getLocationSuggestions(day.locationInput)

                    return (
                      <div className="custom-quote-day-block" key={`custom-quote-day-${dayIndex + 1}`}>
                        {shootDays > 1 ? <h3 className="custom-quote-day-title">Day {dayIndex + 1}</h3> : null}

                        <div className="custom-quote-row">
                          <div className="custom-quote-input-group custom-quote-location-group">
                            <label>Preferred Location</label>
                            <div className="custom-quote-custom-row custom-quote-search-row">
                              <div className="custom-quote-location-autocomplete">
                                <input
                                  type="text"
                                  className="custom-quote-location-input"
                                  value={day.locationInput}
                                  onChange={(event) =>
                                    updateDayForm(dayIndex, {
                                      locationInput: event.target.value,
                                    })
                                  }
                                  onFocus={() => updateDayForm(dayIndex, { isLocationFocused: true })}
                                  onBlur={() =>
                                    window.setTimeout(
                                      () => updateDayForm(dayIndex, { isLocationFocused: false }),
                                      120,
                                    )
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                      event.preventDefault()
                                      addPreferredLocation(dayIndex, day.locationInput)
                                    }
                                  }}
                                  placeholder={locationPlaceholder ? `e.g. ${locationPlaceholder}` : 'e.g.'}
                                />

                                {day.isLocationFocused && normalizeLocation(day.locationInput).length > 0 && suggestions.length ? (
                                  <ul className="custom-quote-suggestions">
                                    {suggestions.map((locationName) => (
                                      <li key={`${locationName}-${dayIndex}`}>
                                        <button
                                          type="button"
                                          onMouseDown={(event) => event.preventDefault()}
                                          onClick={() => addPreferredLocation(dayIndex, locationName)}
                                        >
                                          {locationName}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            </div>

                          </div>

                          <div className="custom-quote-input-group custom-quote-date-group">
                            <label>Target Date</label>
                            <input
                              type="date"
                              className="custom-quote-date-input"
                              value={day.targetDate}
                              onChange={(event) => setDayTargetDate(dayIndex, event.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {dayIndex === 0 ? (
                          <div className="custom-quote-duration-group">
                            <label htmlFor="custom-quote-shoot-days">Total shoot duration in day&apos;s</label>
                            <select
                              id="custom-quote-shoot-days"
                              className="custom-quote-duration-select"
                              value={shootDays}
                              onChange={(event) => {
                                setShootDays(clampShootDays(event.target.value))
                                setFeedback({ type: '', text: '' })
                              }}
                            >
                              {Array.from({ length: MAX_SHOOT_DAYS }, (_, index) => index + 1).map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : null}

                        <div className="custom-quote-selector-group">
                          <label>Preferred Timeslot</label>
                          <div className="custom-quote-tile-grid">
                            {TIME_SLOT_OPTIONS.map((slot) => (
                              <label className="custom-quote-choice" key={`${slot.id}-${dayIndex}`}>
                                <input
                                  type="radio"
                                  name={`preferred-timeslot-${dayIndex}`}
                                  checked={day.timeSlot === slot.id}
                                  onChange={() => updateDayForm(dayIndex, { timeSlot: slot.id })}
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
                              <label className="custom-quote-choice" key={`${item.id}-${dayIndex}`}>
                                <input
                                  type="radio"
                                  name={`required-deliverable-${dayIndex}`}
                                  checked={day.deliverable === item.id}
                                  onChange={() => updateDayForm(dayIndex, { deliverable: item.id })}
                                />
                                <span>
                                  <strong>{item.label}</strong>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}

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

        <AnimatePresence>
          {isLoginPromptOpen ? (
            <Motion.div
              className="custom-quote-login-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsLoginPromptOpen(false)}
            >
              <Motion.div
                className="custom-quote-login-dialog"
                role="dialog"
                aria-modal="true"
                aria-label="Login required"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={(event) => event.stopPropagation()}
              >
                <p>Please login before using this functionality.</p>
                <div className="custom-quote-login-actions">
                  <button
                    type="button"
                    className="custom-quote-login-cancel-btn"
                    onClick={() => setIsLoginPromptOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" className="custom-quote-login-go-btn" onClick={continueToLogin}>
                    Login
                  </button>
                </div>
              </Motion.div>
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default CustomQuoteSection
