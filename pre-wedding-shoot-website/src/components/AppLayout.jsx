import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import SiteFooter from './SiteFooter'

const links = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'photographers', label: 'Photographers', path: '/professionals' },
  { id: 'destinations', label: 'Destinations', path: '/destinations' },
  { id: 'gallery', label: 'Gallery', path: '/gallery' },
]

function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

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
        <NavLink to="/booking" className="nav-cta" onClick={closeMenu}>
          Book Now
        </NavLink>
      </header>

      <Outlet />
      <SiteFooter />
    </div>
  )
}

export default AppLayout
