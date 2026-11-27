import { createHash, timingSafeEqual } from 'node:crypto'
import { handleApiError, HttpError, requireMethod, sendJson } from '../lib/movieNight.js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const ADMIN_LOGIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

function passwordMatches(password) {
  const submittedHash = createHash('sha256').update(password).digest()
  const configuredHash = createHash('sha256').update(ADMIN_PASSWORD).digest()
  return timingSafeEqual(submittedHash, configuredHash)
}

export default async function handler(req, res) {
  try {
    requireMethod(req, 'POST')
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_LOGIN_EMAIL || !ADMIN_PASSWORD) {
      throw new HttpError(503, 'Admin sign-in is not configured.')
    }

    const password = req.body?.password
    if (typeof password !== 'string' || password.length === 0 || password.length > 256) {
      throw new HttpError(400, 'Enter the admin password.')
    }
    if (!passwordMatches(password)) {
      throw new HttpError(401, 'That password could not sign in to the admin dashboard.')
    }

    const adminHeaders = {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
    }
    if (!SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_secret_')) {
      adminHeaders.Authorization = `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    }

    const linkResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ type: 'magiclink', email: ADMIN_LOGIN_EMAIL }),
    })
    const link = await linkResponse.json().catch(() => ({}))
    const tokenHash = link.hashed_token || link.properties?.hashed_token
    if (!linkResponse.ok || !tokenHash) {
      console.error('Unable to prepare the configured admin sign-in.')
      throw new HttpError(503, 'Admin sign-in is temporarily unavailable.')
    }

    const sessionResponse = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ token_hash: tokenHash, type: 'magiclink' }),
    })
    const session = await sessionResponse.json().catch(() => ({}))
    if (!sessionResponse.ok || session.user?.app_metadata?.role !== 'admin') {
      console.error('Configured admin account is not authorized.')
      throw new HttpError(403, 'The configured account cannot access the admin dashboard.')
    }
    return sendJson(res, 200, session)
  } catch (error) {
    return handleApiError(res, error)
  }
}
