import apiHandler from '../../api/movie-night/capacity.js'
import { adaptNetlifyHandler } from '../../lib/netlifyAdapter.js'

export const handler = adaptNetlifyHandler(apiHandler)
