import { NavLink, Outlet } from 'react-router-dom'
import SiteFooter from './SiteFooter'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Professionals', path: '/professionals' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Booking', path: '/booking' },
]

function AppLayout() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark" aria-hidden="true">
            SW
          </div>
          <div className="brand">
            <strong>samplewebname</strong>
            <span>Pre-Wedding Platform</span>
          </div>
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/booking" className="nav-cta">
          Book Now
        </NavLink>
      </header>

      <Outlet />
      <SiteFooter />
    </div>
  )
}

export default AppLayout
