import apiHandler from '../../api/movie-night/status.js'
import { adaptNetlifyHandler } from '../../lib/netlifyAdapter.js'

export const handler = adaptNetlifyHandler(apiHandler)
