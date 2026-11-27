import QRCode from 'qrcode'
import { handleApiError, HttpError, requireMethod } from '../movieNight.js'

const TICKET_CODE_PATTERN = /^MN26-[A-F0-9]{4}$/

export default async function handler(req, res) {
  try {
    requireMethod(req, 'GET')
    const ticketCode = String(req.query?.code || '').trim().toUpperCase()
    if (!TICKET_CODE_PATTERN.test(ticketCode)) {
      throw new HttpError(400, 'Choose a valid ticket code.')
    }

    const image = await QRCode.toBuffer(ticketCode, {
      type: 'png',
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: { dark: '#07152E', light: '#FFFFFF' },
    })
    res.status(200).setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    return res.end(image)
  } catch (error) {
    return handleApiError(res, error)
  }
}
