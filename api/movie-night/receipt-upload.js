import { randomUUID } from 'node:crypto'
import {
  createReceiptUpload,
  handleApiError,
  HttpError,
  MAX_RECEIPT_BYTES,
  requireMethod,
  requireSupabaseConfig,
  sendJson,
} from '../../lib/movieNight.js'

const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}

export default async function handler(req, res) {
  try {
    requireMethod(req, 'POST')
    requireSupabaseConfig()
    const body = req.body && typeof req.body === 'object' ? req.body : {}
    const mimeType = String(body.mimeType || '').toLowerCase()
    const size = Number(body.size)
    if (!MIME_TYPES.has(mimeType)) throw new HttpError(400, 'Choose a JPG, PNG, WEBP, or PDF receipt.')
    if (!Number.isInteger(size) || size < 1 || size > MAX_RECEIPT_BYTES) {
      throw new HttpError(400, 'Receipt files must be no larger than 5MB.')
    }

    const path = `staged/${randomUUID()}.${EXTENSIONS[mimeType]}`
    const uploadUrl = await createReceiptUpload(path, mimeType)
    return sendJson(res, 201, { path, uploadUrl })
  } catch (error) {
    return handleApiError(res, error)
  }
}
