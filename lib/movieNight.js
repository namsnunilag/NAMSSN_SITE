export const RECEIPT_BUCKET = 'movie-night-receipts'
export const MAX_RECEIPT_BYTES = 5 * 1024 * 1024
const PUBLIC_SITE_URL = (process.env.MOVIE_NIGHT_PUBLIC_URL || 'https://www.namssnunilag.one').replace(/\/+$/, '')
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || ''
const EMAILJS_MOVIE_NIGHT_TEMPLATE_ID = process.env.EMAILJS_MOVIE_NIGHT_TEMPLATE_ID || ''

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export function requireMethod(req, method) {
  if (req.method !== method) {
    throw new HttpError(405, 'That request method is not supported.')
  }
}

export function requireSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new HttpError(503, 'Movie Night ticket services are not configured yet.')
  }
}

function serviceHeaders(extra = {}) {
  requireSupabaseConfig()
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  }
}

export async function serviceRequest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: serviceHeaders(options.headers),
  })
  const raw = await response.text()
  let data
  try {
    data = raw ? JSON.parse(raw) : null
  } catch {
    data = raw
  }
  if (!response.ok) {
    if (
      data?.code === 'PGRST205'
      || data?.code === 'PGRST202'
      || /schema cache|could not find the table|could not find the function/i.test(data?.message || '')
    ) {
      throw new HttpError(
        503,
        'Movie Night database setup is incomplete. Ask the site administrator to run supabase/migrations/20261127_movie_night.sql in Supabase SQL Editor, then refresh this page.',
      )
    }
    const message = typeof data?.message === 'string' ? data.message : `Database request failed (${response.status}).`
    throw new HttpError(response.status >= 500 ? 502 : response.status, message)
  }
  return data
}

export async function requireAdmin(req) {
  requireSupabaseConfig()
  if (!SUPABASE_ANON_KEY) throw new HttpError(503, 'Admin sign-in is not configured.')
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) throw new HttpError(401, 'Please sign in as an administrator.')

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new HttpError(401, 'Please sign in as an administrator.')
  const user = await response.json()
  if (user.app_metadata?.role !== 'admin') {
    throw new HttpError(403, 'This account cannot manage Movie Night tickets.')
  }
  return user
}

export function storageObjectPath(path) {
  return path.split('/').map(encodeURIComponent).join('/')
}

export async function createReceiptUpload(path, mimeType) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/upload/sign/${RECEIPT_BUCKET}/${storageObjectPath(path)}`,
    {
      method: 'POST',
      headers: serviceHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ upsert: false, contentType: mimeType }),
    },
  )
  const signed = await response.json().catch(() => ({}))
  if (!response.ok || !signed.url || !signed.token) {
    throw new HttpError(502, 'A receipt upload link could not be prepared. Please try again.')
  }
  return `${SUPABASE_URL}/storage/v1${signed.url}`
}

export async function downloadReceipt(path) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${RECEIPT_BUCKET}/${storageObjectPath(path)}`,
    { headers: serviceHeaders() },
  )
  if (!response.ok) {
    throw new HttpError(400, 'The receipt upload could not be found. Please upload it again.')
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  if (!bytes.length || bytes.length > MAX_RECEIPT_BYTES) {
    throw new HttpError(400, 'Receipt files must be no larger than 5MB.')
  }
  return { bytes, mimeType: response.headers.get('content-type')?.split(';')[0].toLowerCase() || '' }
}

export async function removeReceipt(path) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${RECEIPT_BUCKET}/${storageObjectPath(path)}`,
    { method: 'DELETE', headers: serviceHeaders() },
  )
  if (!response.ok) throw new Error('Unable to remove the unused receipt upload.')
}

export async function createReceiptLink(path) {
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${RECEIPT_BUCKET}/${storageObjectPath(path)}`,
    {
      method: 'POST',
      headers: serviceHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ expiresIn: 300 }),
    },
  )
  const signed = await response.json().catch(() => ({}))
  if (!response.ok || !signed.signedURL) {
    throw new HttpError(502, 'The receipt preview could not be opened.')
  }
  return `${SUPABASE_URL}/storage/v1${signed.signedURL}`
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

export async function updateTicketEmail(ticketId, sent, error = null) {
  await serviceRequest(
    `/rest/v1/movie_night_tickets?id=eq.${encodeURIComponent(ticketId)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ email_sent: sent, email_error: error }),
    },
  )
}

export async function sendTicketEmail(ticket) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_MOVIE_NIGHT_TEMPLATE_ID) {
    const message = 'Email delivery is not ready yet.'
    await updateTicketEmail(ticket.id, false, message)
    return { sent: false, error: message }
  }

  try {
    const tier = ticket.ticket_type === 'couples' ? 'Couples Pass' : 'Single Pass'
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_MOVIE_NIGHT_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: ticket.holder_email,
          attendee_name: escapeHtml(ticket.holder_name),
          ticket_tier: tier,
          ticket_code: ticket.ticket_code,
          event_date: 'Friday, Dec 18, 2026 (18 • 12 • 2026)',
          event_time: '6:00 PM Prompt',
          event_venue: 'LT018, UNILAG',
          email_subject: 'Payment Confirmed — Your NAMSSN Movie Night E-Ticket',
          ticket_qr_url: `${PUBLIC_SITE_URL}/api/movie-night/ticket-qr?code=${encodeURIComponent(ticket.ticket_code)}`,
        },
      }),
    })
    const responseText = await response.text()
    if (!response.ok) throw new Error(responseText || 'The email provider could not deliver this ticket.')

    await updateTicketEmail(ticket.id, true)
    return { sent: true }
  } catch (error) {
    console.error(`Movie Night ticket email failed for ${ticket.ticket_code}:`, error)
    const message = 'We could not send this e-ticket. Please try again or check email setup.'
    await updateTicketEmail(ticket.id, false, message)
    return { sent: false, error: message }
  }
}

export function handleApiError(res, error) {
  const text = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  if (text.includes('duplicate_receipt')) {
    return sendJson(res, 409, { error: 'This receipt has already been used for an order.' })
  }
  if (text.includes('tickets_sold_out')) {
    return sendJson(res, 409, { error: 'Tickets Sold Out. No more ticket slots are available.' })
  }
  if (text.includes('only_one_ticket_spot_remains')) {
    return sendJson(res, 409, { error: 'Only one ticket spot remains, so the Couples Pass is no longer available. Try a Single Pass.' })
  }
  if (text.includes('could_not_create_order_reference') || text.includes('could_not_create_ticket_code')) {
    return sendJson(res, 503, { error: 'We could not prepare your ticket. Please try again.' })
  }
  if (text.includes('invalid_ticket_type') || text.includes('required_details_missing') || text.includes('invalid_partner_details')) {
    return sendJson(res, 400, { error: 'Please check the attendee details and try again.' })
  }
  if (error instanceof HttpError) {
    return sendJson(res, error.status, { error: error.message })
  }
  console.error('Movie Night API error:', error)
  return sendJson(res, 500, { error: 'We could not complete that request. Please try again.' })
}
