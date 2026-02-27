import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createAccount, getCurrentSession, loginAccount, loginWithSocial } from '../utils/authStorage'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.09-1.92 3.28-4.75 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.45-.98 7.27-2.65l-3.56-2.76c-.99.67-2.24 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.12A6.61 6.61 0 0 1 5.49 12c0-.74.13-1.45.35-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.96l2.86-2.23.8-.61z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.35c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.08 14.97 1 12 1A11 11 0 0 0 2.18 7.04l3.66 2.84C6.71 7.28 9.14 5.35 12 5.35z"
        fill="#EA4335"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.95.93-1.95 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  )
}

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

  const onSocialLogin = async (provider) => {
    setMessage('')
    const response = await loginWithSocial({ provider, redirectPath: redirectTo })
    if (!response.ok) {
      setIsError(true)
      setMessage(response.message)
      return
    }
    setIsError(false)
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

          <div className="auth-social-divider">
            <span>or continue with</span>
          </div>

          <div className="auth-social-buttons">
            <button
              type="button"
              className="auth-social-btn auth-social-google"
              onClick={() => onSocialLogin('google')}
              aria-label="Continue with Google"
            >
              <GoogleIcon />
            </button>
            <button
              type="button"
              className="auth-social-btn auth-social-facebook"
              onClick={() => onSocialLogin('facebook')}
              aria-label="Continue with Facebook"
            >
              <FacebookIcon />
            </button>
          </div>

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


