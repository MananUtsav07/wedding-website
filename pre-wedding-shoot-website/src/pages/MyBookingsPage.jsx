import { NavLink, useNavigate } from 'react-router-dom'
import { getCurrentSession, logoutAccount } from '../utils/authStorage'

function getInitials(session) {
  const source = (session?.fullName || session?.email || 'U').trim()
  if (!source) {
    return 'U'
  }
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

function MyBookingsPage() {
  const navigate = useNavigate()
  const session = getCurrentSession()
  const initials = getInitials(session)

  const onLogout = async () => {
    await logoutAccount()
    navigate('/login')
  }

  return (
    <main className="page account-page">
      <section className="section account-header-card">
        <div className="account-profile-wrap">
          <div className="account-avatar-large">{initials}</div>
          <div className="account-profile-meta">
            <h1>{session?.fullName || 'User Account'}</h1>
            <p>{session?.email || 'No active session found'}</p>
          </div>
        </div>
      </section>

      <section className="section account-content-shell">
        <aside className="account-sidebar">
          <NavLink to="/account" className="account-side-link">
            My Profile
          </NavLink>
          <NavLink to="/my-bookings" end className={({ isActive }) => (isActive ? 'account-side-link active' : 'account-side-link')}>
            My Bookings
          </NavLink>
          <button type="button" className="account-side-link account-side-logout" onClick={onLogout}>
            Logout
          </button>
        </aside>

        <div className="account-main-panels">
          <article className="account-panel">
            <h2>My Bookings</h2>
            <p className="account-empty">No active bookings for now.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default MyBookingsPage
