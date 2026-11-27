import {
  createReceiptLink,
  handleApiError,
  HttpError,
  requireAdmin,
  requireMethod,
  requireSupabaseConfig,
  sendJson,
  sendTicketEmail,
  serviceRequest,
} from '../movieNight.js'

const ORDER_FIELDS = [
  'id', 'order_ref', 'ticket_type', 'ticket_count', 'amount_ngn', 'buyer_name',
  'buyer_email', 'buyer_phone', 'payer_account_name', 'partner_name', 'partner_email',
  'payment_status', 'decline_reason', 'reviewed_by', 'reviewed_at', 'created_at',
].join(',')

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
async function getOrders() {
  return serviceRequest(
    `/rest/v1/movie_night_orders?select=${ORDER_FIELDS}&order=created_at.desc`,
  )
}

async function getTickets() {
  return serviceRequest(
    '/rest/v1/movie_night_tickets?select=*&order=created_at.desc',
  )
}

function isValidId(id) {
  return typeof id === 'string' && UUID_PATTERN.test(id)
}

export default async function handler(req, res) {
  try {
    requireSupabaseConfig()
    const admin = await requireAdmin(req)
    if (req.method === 'GET') {
      const view = String(req.query?.view || '')
      if (view === 'receipt') {
        const orderId = String(req.query?.id || '')
        if (!isValidId(orderId)) throw new HttpError(400, 'Choose a valid order.')
        const rows = await serviceRequest(
          `/rest/v1/movie_night_orders?select=receipt_path&id=eq.${encodeURIComponent(orderId)}&limit=1`,
        )
        if (!rows.length) throw new HttpError(404, 'That order could not be found.')
        return sendJson(res, 200, { url: await createReceiptLink(rows[0].receipt_path) })
      }
      if (view !== 'data') throw new HttpError(400, 'Choose a valid Movie Night view.')

      const [orders, tickets, capacityRows] = await Promise.all([
        getOrders(),
        getTickets(),
        serviceRequest('/rest/v1/rpc/movie_night_capacity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }),
      ])
      const capacity = Array.isArray(capacityRows) ? capacityRows[0] : capacityRows
      return sendJson(res, 200, {
        orders,
        tickets,
        capacity: {
          sold: Number(capacity?.ticket_slots || 0),
          max: Number(capacity?.max_tickets || 100),
          remaining: Number(capacity?.remaining || 0),
        },
        confirmedRevenue: orders
          .filter(order => order.payment_status === 'confirmed')
          .reduce((sum, order) => sum + order.amount_ngn, 0),
        pendingCount: orders.filter(order => order.payment_status === 'unconfirmed').length,
        declinedCount: orders.filter(order => order.payment_status === 'declined').length,
        checkinCount: tickets.filter(ticket => ticket.checked_in).length,
        adminEmail: admin.email,
      })
    }

    requireMethod(req, 'POST')
    const body = req.body && typeof req.body === 'object' ? req.body : {}
    if (body.action === 'confirm') {
      if (!isValidId(body.orderId)) throw new HttpError(400, 'Choose a valid order.')
      const result = await serviceRequest('/rest/v1/rpc/movie_night_confirm_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_order_id: body.orderId, p_reviewed_by: admin.email || admin.id }),
      })
      const confirmation = Array.isArray(result) ? result[0] : result
      if (!confirmation?.confirmed) {
        throw new HttpError(409, 'This order has already been reviewed.')
      }
      const emailResults = await Promise.all(
        confirmation.tickets.map(ticket => sendTicketEmail(ticket)),
      )
      return sendJson(res, 200, {
        confirmed: true,
        orderRef: confirmation.order_ref,
        tickets: confirmation.tickets.map((ticket, index) => ({
          ticketCode: ticket.ticket_code,
          emailSent: emailResults[index].sent,
          emailError: emailResults[index].error || null,
        })),
      })
    }

    if (body.action === 'decline') {
      if (!isValidId(body.orderId)) throw new HttpError(400, 'Choose a valid order.')
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (!reason || reason.length > 500) throw new HttpError(400, 'Add a short reason for declining this payment.')
      const response = await serviceRequest(
        `/rest/v1/movie_night_orders?id=eq.${encodeURIComponent(body.orderId)}&payment_status=eq.unconfirmed`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify({
            payment_status: 'declined',
            decline_reason: reason,
            reviewed_by: admin.email || admin.id,
            reviewed_at: new Date().toISOString(),
          }),
        },
      )
      if (!response.length) throw new HttpError(409, 'This order has already been reviewed.')
      return sendJson(res, 200, { declined: true })
    }

    if (body.action === 'resend') {
      if (!isValidId(body.ticketId)) throw new HttpError(400, 'Choose a valid ticket.')
      const rows = await serviceRequest(
        `/rest/v1/movie_night_tickets?select=*&id=eq.${encodeURIComponent(body.ticketId)}&limit=1`,
      )
      if (!rows.length) throw new HttpError(404, 'That ticket could not be found.')
      const result = await sendTicketEmail(rows[0])
      return sendJson(res, result.sent ? 200 : 502, result)
    }

    if (body.action === 'checkin') {
      if (!isValidId(body.ticketId) || typeof body.checkedIn !== 'boolean') {
        throw new HttpError(400, 'Choose a valid ticket check-in update.')
      }
      const response = await serviceRequest(
        `/rest/v1/movie_night_tickets?id=eq.${encodeURIComponent(body.ticketId)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify({
            checked_in: body.checkedIn,
            checked_in_at: body.checkedIn ? new Date().toISOString() : null,
          }),
        },
      )
      if (!response.length) throw new HttpError(404, 'That ticket could not be found.')
      return sendJson(res, 200, { ticket: response[0] })
    }

    throw new HttpError(400, 'Choose a valid Movie Night action.')
  } catch (error) {
    return handleApiError(res, error)
  }
}
