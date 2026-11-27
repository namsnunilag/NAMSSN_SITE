import { createHash } from 'node:crypto'
import {
  downloadReceipt,
  handleApiError,
  HttpError,
  MAX_RECEIPT_BYTES,
  requireMethod,
  requireSupabaseConfig,
  sendJson,
  serviceRequest,
  removeReceipt,
} from '../movieNight.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STAGED_RECEIPT_PATH = /^staged\/[0-9a-f-]{36}\.(jpg|png|webp|pdf)$/i

function validateReceipt(bytes, mimeType) {
  if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(mimeType)) {
    throw new HttpError(400, 'Upload a JPG, PNG, WEBP, or PDF receipt.')
  }
  if (!bytes.length || bytes.length > MAX_RECEIPT_BYTES) {
    throw new HttpError(400, 'Receipt files must be no larger than 5MB.')
  }

  const isValid = {
    'image/jpeg': bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
    'image/png': bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    'image/webp': bytes.subarray(0, 4).toString() === 'RIFF'
      && bytes.subarray(8, 12).toString() === 'WEBP',
    'application/pdf': bytes.subarray(0, 5).toString() === '%PDF-',
  }[mimeType]
  if (!isValid) throw new HttpError(400, 'The selected file does not match its file type.')
}

function requiredText(value, label, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new HttpError(400, `Please enter a valid ${label}.`)
  }
  return value.trim()
}

export default async function handler(req, res) {
  let uploadedPath = ''
  try {
    requireMethod(req, 'POST')
    requireSupabaseConfig()
    const body = req.body && typeof req.body === 'object' ? req.body : {}
    const ticketType = body.ticketType
    if (!['single', 'couples'].includes(ticketType)) throw new HttpError(400, 'Choose a ticket type.')
    if (typeof body.receiptPath !== 'string' || !STAGED_RECEIPT_PATH.test(body.receiptPath)) {
      throw new HttpError(400, 'Upload your transfer receipt before submitting.')
    }
    uploadedPath = body.receiptPath

    const buyerName = requiredText(body.buyerName, 'full name', 120)
    const buyerEmail = requiredText(body.buyerEmail, 'email address', 254).toLowerCase()
    const buyerPhone = requiredText(body.buyerPhone, 'phone number', 40)
    const payerAccountName = requiredText(body.payerAccountName, 'sender account name', 120)
    if (!EMAIL_PATTERN.test(buyerEmail)) throw new HttpError(400, 'Enter a valid email address.')

    let partnerName = null
    let partnerEmail = null
    if (ticketType === 'couples') {
      partnerName = requiredText(body.partnerName, "partner's full name", 120)
      partnerEmail = requiredText(body.partnerEmail, "partner's email address", 254).toLowerCase()
      if (!EMAIL_PATTERN.test(partnerEmail)) throw new HttpError(400, "Enter a valid partner's email address.")
      if (partnerEmail === buyerEmail) throw new HttpError(400, 'Use a different email for each attendee.')
    }

    const { bytes, mimeType } = await downloadReceipt(uploadedPath)
    validateReceipt(bytes, mimeType)
    const receiptHash = createHash('sha256').update(bytes).digest('hex')
    const order = await serviceRequest('/rest/v1/rpc/movie_night_submit_order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        p_ticket_type: ticketType,
        p_buyer_name: buyerName,
        p_buyer_email: buyerEmail,
        p_buyer_phone: buyerPhone,
        p_payer_account_name: payerAccountName,
        p_partner_name: partnerName,
        p_partner_email: partnerEmail,
        p_receipt_path: uploadedPath,
        p_receipt_hash: receiptHash,
      }),
    })
    const created = Array.isArray(order) ? order[0] : order
    uploadedPath = ''
    return sendJson(res, 201, {
      orderRef: created.order_ref,
      amountNgn: created.amount_ngn,
      ticketCount: created.ticket_count,
      status: 'unconfirmed',
    })
  } catch (error) {
    if (uploadedPath) {
      await removeReceipt(uploadedPath).catch(cleanupError => {
        console.error('Unable to remove unused Movie Night receipt:', cleanupError)
      })
    }
    return handleApiError(res, error)
  }
}
