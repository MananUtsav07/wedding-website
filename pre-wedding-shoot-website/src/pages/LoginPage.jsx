import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createAccount, getCurrentSession, loginAccount } from '../utils/authStorage'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.redirectTo || '/'
  const [mode, setMode] = useState('signin')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [session, setSession] = useState(() => getCurrentSession())
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const syncSession = () => setSession(getCurrentSession())
    window.addEventListener('auth-changed', syncSession)
    window.addEventListener('focus', syncSession)
    return () => {
      window.removeEventListener('auth-changed', syncSession)
      window.removeEventListener('focus', syncSession)
    }
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (mode === 'signup') {
      if (form.password.length < 8) {
        setIsError(true)
        setMessage('Password must be at least 8 characters long.')
        return
      }

      if (form.password !== form.confirmPassword) {
        setIsError(true)
        setMessage('Passwords do not match.')
        return
      }

      const created = await createAccount({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      })

      if (!created.ok) {
        setIsError(true)
        setMessage(created.message)
        return
      }

      setIsError(false)
      if (created.needsEmailConfirmation) {
        setMessage(created.message)
        return
      }

      setMessage('Account created successfully. Redirecting to home...')
      window.setTimeout(() => navigate(redirectTo), 900)
      return
    }

    const signedIn = await loginAccount({ email: form.email, password: form.password })
    if (!signedIn.ok) {
      setIsError(true)
      setMessage(signedIn.message)
      return
    }

    setIsError(false)
    setMessage('Login successful. Redirecting to home...')
    window.setTimeout(() => navigate(redirectTo), 900)
  }

  return (
    <main className="auth-page">
      <section className="auth-hero-panel">
        <div className="auth-hero-overlay" />
        <div className="auth-hero-content">
          <div className="auth-logo-mark">PW</div>
          <h1>Pre & Wedding Shoot</h1>
          <p>Access your account to manage destination shoots, slots, and booking workflow.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-head">
            <h2>{mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}</h2>
            <p>
              {mode === 'signin'
                ? 'Sign in to continue your photography planning.'
                : 'Create an account to book and track your shoots.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {mode === 'signup' ? (
              <label>
                Full Name
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  required
                  placeholder="Your full name"
                />
              </label>
            ) : null}

            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="name@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                minLength={8}
                required
                placeholder="********"
              />
            </label>

            {mode === 'signup' ? (
              <label>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  minLength={8}
                  required
                  placeholder="********"
                />
              </label>
            ) : null}

            <button type="submit" className="auth-submit-btn">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {message ? <p className={isError ? 'auth-message error' : 'auth-message'}>{message}</p> : null}

          <p className="auth-session-note">
            {session
              ? `Logged in as ${session.fullName} (${session.email})`
              : 'No active session. Create an account or sign in to continue.'}
          </p>

          <p className="auth-inline-switch">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
              {mode === 'signin' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage


