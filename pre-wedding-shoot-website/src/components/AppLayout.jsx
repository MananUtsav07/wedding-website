import { NavLink, Outlet } from 'react-router-dom'

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
        <div className="brand">
          <strong>pre-wedding-shoot</strong>
          <span>Pre-Wedding Platform</span>
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
      </header>

      <Outlet />
    </div>
  )
}

export default AppLayout
