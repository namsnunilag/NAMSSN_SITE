import apiHandler from '../../api/movie-night/ticket-qr.js'
import { adaptNetlifyHandler } from '../../lib/netlifyAdapter.js'

export const handler = adaptNetlifyHandler(apiHandler)
