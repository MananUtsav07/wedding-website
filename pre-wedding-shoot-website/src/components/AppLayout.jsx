import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getCurrentSession, hydrateSession, logoutAccount, subscribeToAuthChanges } from '../utils/authStorage'
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
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef(null)

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsAccountMenuOpen(false)
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleSignOut = async () => {
    await logoutAccount()
    setIsAccountMenuOpen(false)
    closeMenu()
    navigate('/login')
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
              <div className="account-menu-wrap" ref={accountMenuRef}>
                <button
                  type="button"
                  className="account-avatar-btn"
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                  onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                >
                  {avatarLabel}
                </button>
                {isAccountMenuOpen ? (
                  <div className="account-dropdown" role="menu">
                    <button type="button" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
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
