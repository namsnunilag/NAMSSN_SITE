import {
  handleApiError,
  HttpError,
  requireMethod,
  requireSupabaseConfig,
  sendJson,
  serviceRequest,
} from '../../lib/movieNight.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ORDER_REF_PATTERN = /^MNO-[A-Z0-9]{4}$/i

function publicStatus(status) {
  if (status === 'confirmed') return 'Confirmed'
  if (status === 'declined') return 'Declined'
  return 'Pending Verification'
}

export default async function handler(req, res) {
  try {
    requireMethod(req, 'GET')
    requireSupabaseConfig()
    const lookup = String(req.query?.lookup || '').trim()
    if (ORDER_REF_PATTERN.test(lookup)) {
      const orderRef = lookup.toUpperCase()
      const rows = await serviceRequest(
        `/rest/v1/movie_night_orders?select=order_ref,payment_status,decline_reason&order_ref=eq.${encodeURIComponent(orderRef)}&limit=1`,
      )
      if (!rows.length) throw new HttpError(404, 'We could not find an order with those details.')
      return sendJson(res, 200, {
        orderRef: rows[0].order_ref,
        status: publicStatus(rows[0].payment_status),
        declineReason: rows[0].payment_status === 'declined' ? rows[0].decline_reason : null,
      })
    }

    const email = lookup.toLowerCase()
    if (!EMAIL_PATTERN.test(email)) {
      throw new HttpError(400, 'Enter your email address or order reference.')
    }
    const emailFilter = encodeURIComponent(email)
    const [buyerOrders, partnerOrders] = await Promise.all([
      serviceRequest(
        `/rest/v1/movie_night_orders?select=order_ref,payment_status,decline_reason,created_at&buyer_email=eq.${emailFilter}&order=created_at.desc&limit=5`,
      ),
      serviceRequest(
        `/rest/v1/movie_night_orders?select=order_ref,payment_status,decline_reason,created_at&partner_email=eq.${emailFilter}&order=created_at.desc&limit=5`,
      ),
    ])
    const rows = [...new Map([...buyerOrders, ...partnerOrders].map(order => [order.order_ref, order])).values()]
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .slice(0, 5)
    if (!rows.length) throw new HttpError(404, 'We could not find an order with those details.')
    return sendJson(res, 200, {
      orders: rows.map(row => ({
        orderRef: row.order_ref,
        status: publicStatus(row.payment_status),
        declineReason: row.payment_status === 'declined' ? row.decline_reason : null,
      })),
    })
  } catch (error) {
    return handleApiError(res, error)
  }
}
