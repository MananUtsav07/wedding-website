import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link, Navigate, useParams } from 'react-router-dom'
import { fetchProfessionalPhotoUrls } from '../api/mediaApi'
import SafeImage from '../components/SafeImage'
import { defaultProfessionalProfile, professionalProfileDetails } from '../data/professionalProfiles'
import { professionals } from '../data/siteData'

const PROFILE_TABS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services Provided' },
  { id: 'projects', label: 'Projects' },
]

function PhotographerProfilePage() {
  const { professionalId } = useParams()
  const [activeTab, setActiveTab] = useState('about')
  const [photoUrl, setPhotoUrl] = useState('')

  const professional = useMemo(
    () => professionals.find((pro) => pro.id === professionalId),
    [professionalId],
  )

  const profileDetails = useMemo(() => {
    if (!professional) {
      return defaultProfessionalProfile
    }
    return professionalProfileDetails[professional.id] ?? defaultProfessionalProfile
  }, [professional])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [professionalId])

  useEffect(() => {
    if (!professional) {
      return undefined
    }

    let mounted = true
    const loadPhoto = async () => {
      const urls = await fetchProfessionalPhotoUrls([professional])
      if (mounted) {
        setPhotoUrl(urls[professional.id] ?? '')
      }
    }

    loadPhoto()
    return () => {
      mounted = false
    }
  }, [professional])

  if (!professional) {
    return <Navigate to="/professionals" replace />
  }

  const renderTabContent = () => {
    if (activeTab === 'services') {
      return (
        <div className="photographer-tab-content">
          <h2>Services Provided by {professional.name}</h2>
          <ul>
            {profileDetails.services.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )
    }

    if (activeTab === 'projects') {
      return (
        <div className="photographer-tab-content">
          <h2>Projects</h2>
          <p>No projects added yet.</p>
        </div>
      )
    }

    return (
      <div className="photographer-tab-content">
        <h2>About {professional.name}</h2>
        <p>{profileDetails.about}</p>
        <p>
          Based in {professional.locationLabel}, {professional.name} blends planning, location-aware composition,
          and couple-focused direction to keep the shoot smooth from start to final delivery.
        </p>
      </div>
    )
  }

  return (
    <main className="page photographer-profile-page">
      <section className="section photographer-profile-shell">
        <Link to="/professionals" className="photographer-back-link">
          Back
        </Link>

        <Motion.div
          className="photographer-profile-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="photographer-profile-media">
            <SafeImage src={photoUrl} alt={professional.name} />
          </div>
          <div className="photographer-profile-meta">
            <h1>{professional.name}</h1>
            <p className="photographer-profile-type">{professional.type}</p>
            <p className="photographer-profile-location">{professional.locationLabel}</p>
          </div>
        </Motion.div>

        <div className="photographer-tabs" role="tablist" aria-label="Photographer Profile Tabs">
          {PROFILE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? 'photographer-tab-btn active' : 'photographer-tab-btn'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Motion.article
          className="photographer-tab-panel"
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {renderTabContent()}
        </Motion.article>
      </section>
    </main>
  )
}

export default PhotographerProfilePage
