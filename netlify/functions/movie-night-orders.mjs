import apiHandler from '../../api/movie-night/orders.js'
import { adaptNetlifyHandler } from '../../lib/netlifyAdapter.js'

export const handler = adaptNetlifyHandler(apiHandler)
