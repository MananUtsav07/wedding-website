import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getCurrentSession, hydrateSession, subscribeToAuthChanges } from '../utils/authStorage'
import SiteFooter from './SiteFooter'

const links = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'photographers', label: 'Photographers', path: '/professionals' },
  { id: 'destinations', label: 'Destinations', path: '/destinations' },
  { id: 'gallery', label: 'Gallery', path: '/gallery' },
]

function AppLayout() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [session, setSession] = useState(() => getCurrentSession())

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const syncSession = () => setSession(getCurrentSession())

    hydrateSession()
    const unsubscribe = subscribeToAuthChanges()

    window.addEventListener('auth-changed', syncSession)
    window.addEventListener('storage', syncSession)
    window.addEventListener('focus', syncSession)

    return () => {
      unsubscribe()
      window.removeEventListener('auth-changed', syncSession)
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('focus', syncSession)
    }
  }, [])

  const handleOpenAccount = () => {
    closeMenu()
    navigate('/account')
  }

  const avatarLabel = (session?.fullName || session?.email || 'U').trim().charAt(0).toUpperCase()

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand">
            <strong>Pre & Wedding Shoot</strong>
          </div>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="topbar-actions">
          {session ? (
            <>
              <NavLink to="/booking" className="nav-cta" onClick={closeMenu}>
                Book Now
              </NavLink>
              <button type="button" className="account-avatar-btn" onClick={handleOpenAccount} aria-label="Open account">
                {avatarLabel}
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-cta" onClick={closeMenu}>
              Login
            </NavLink>
          )}
        </div>
      </header>

      <Outlet />
      <SiteFooter />
    </div>
  )
}

export default AppLayout
