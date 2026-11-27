import {
  handleApiError,
  requireMethod,
  requireSupabaseConfig,
  sendJson,
  serviceRequest,
} from '../movieNight.js'

export default async function handler(req, res) {
  try {
    requireMethod(req, 'GET')
    requireSupabaseConfig()
    const result = await serviceRequest('/rest/v1/rpc/movie_night_capacity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    const capacity = Array.isArray(result) ? result[0] : result
    if (!capacity) throw new Error('Capacity information was not returned.')
    return sendJson(res, 200, {
      sold: Number(capacity.ticket_slots),
      max: Number(capacity.max_tickets),
      remaining: Number(capacity.remaining),
    })
  } catch (error) {
    return handleApiError(res, error)
  }
}
