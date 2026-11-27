import admin from '../lib/movie-night-api/admin.js'
import capacity from '../lib/movie-night-api/capacity.js'
import orders from '../lib/movie-night-api/orders.js'
import receiptUpload from '../lib/movie-night-api/receipt-upload.js'
import status from '../lib/movie-night-api/status.js'
import ticketQr from '../lib/movie-night-api/ticket-qr.js'
import { sendJson } from '../lib/movieNight.js'

const handlers = {
  'movie-night/admin': admin,
  'movie-night/capacity': capacity,
  'movie-night/orders': orders,
  'movie-night/receipt-upload': receiptUpload,
  'movie-night/status': status,
  'movie-night/ticket-qr': ticketQr,
}

export default function handler(req, res) {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname
  const route = pathname.replace(/^\/api\//, '').replace(/\/+$/, '')
  const routeHandler = Object.hasOwn(handlers, route) ? handlers[route] : undefined

  if (!routeHandler) {
    return sendJson(res, 404, { error: 'That API route could not be found.' })
  }

  return routeHandler(req, res)
}
