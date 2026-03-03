import { isSupabaseConfigured, supabase } from './supabaseClient'
const SESSION_KEY = 'pw_auth_session_v1'
const APP_URL = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '')

function normalizeRedirectPath(path = '/') {
  if (!path) {
    return '/'
  }
  return path.startsWith('/') ? path : `/${path}`
}

function emitAuthChanged() {
  window.dispatchEvent(new CustomEvent('auth-changed'))
}

function toSessionShape(session) {
  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id,
    fullName: session.user.user_metadata?.full_name || session.user.email,
    email: session.user.email,
  }
}

function writeSessionCache(session) {
  const shaped = toSessionShape(session)
  if (!shaped) {
    localStorage.removeItem(SESSION_KEY)
    emitAuthChanged()
    return null
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(shaped))
  emitAuthChanged()
  return shaped
}

function ensureConfigured() {
  if (isSupabaseConfigured) {
    return true
  }
  return false
}

function normalizeAuthError(error, fallback = 'Authentication request failed. Please try again.') {
  const message = String(error?.message || '').toLowerCase()
  if (
    message.includes('failed to fetch') ||
    message.includes('load failed') ||
    message.includes('networkerror')
  ) {
    return 'Could not reach authentication server. Check internet, Supabase URL settings, and allowed site URLs.'
  }
  return error?.message || fallback
}

export async function createAccount({ fullName, email, password }) {
  if (!ensureConfigured()) {
    return {
      ok: false,
      message: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
    }
  }

  let data
  let error
  try {
    const response = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: `${APP_URL}/login`,
      },
    })
    data = response.data
    error = response.error
  } catch (caughtError) {
    return { ok: false, message: normalizeAuthError(caughtError, 'Signup failed. Please try again.') }
  }

  if (error) {
    return { ok: false, message: error.message }
  }

  const shapedSession = writeSessionCache(data.session)
  if (!shapedSession) {
    return {
      ok: true,
      needsEmailConfirmation: true,
      message: 'Account created. Please verify your email, then login.',
    }
  }

  return { ok: true, user: shapedSession }
}

export async function loginAccount({ email, password }) {
  if (!ensureConfigured()) {
    return {
      ok: false,
      message: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
    }
  }

  let data
  let error
  try {
    const response = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    data = response.data
    error = response.error
  } catch (caughtError) {
    return { ok: false, message: normalizeAuthError(caughtError, 'Login failed. Please try again.') }
  }

  if (error) {
    return { ok: false, message: error.message }
  }

  const shapedSession = writeSessionCache(data.session)
  if (!shapedSession) {
    return { ok: false, message: 'Login failed. Please try again.' }
  }

  return { ok: true, user: shapedSession }
}

export async function loginWithSocial({ provider = 'google', redirectPath = '/' } = {}) {
  if (!ensureConfigured()) {
    return {
      ok: false,
      message: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
    }
  }

  const origin = window.location.origin.replace(/\/$/, '')
  const redirectTo = `${origin}${normalizeRedirectPath(redirectPath)}`

  let error
  try {
    const response = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })
    error = response.error
  } catch (caughtError) {
    return { ok: false, message: normalizeAuthError(caughtError, 'Social login failed. Please try again.') }
  }

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}

export function getCurrentSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function hydrateSession() {
  if (!ensureConfigured()) {
    return getCurrentSession()
  }

  const { data } = await supabase.auth.getSession()
  return writeSessionCache(data.session)
}

export function subscribeToAuthChanges() {
  if (!ensureConfigured()) {
    return () => {}
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    writeSessionCache(session)
  })

  return () => subscription.unsubscribe()
}

export async function logoutAccount() {
  if (!ensureConfigured()) {
    localStorage.removeItem(SESSION_KEY)
    emitAuthChanged()
    return
  }

  await supabase.auth.signOut()
  localStorage.removeItem(SESSION_KEY)
  emitAuthChanged()
}
