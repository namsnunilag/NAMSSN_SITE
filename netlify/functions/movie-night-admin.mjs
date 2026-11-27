import apiHandler from '../../api/movie-night/admin.js'
import { adaptNetlifyHandler } from '../../lib/netlifyAdapter.js'

export const handler = adaptNetlifyHandler(apiHandler)
