import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function localApi() {
  const handlers = {
    '/api/admin-login': () => import('./api/admin-login.js'),
    '/api/movie-night/admin': () => import('./api/movie-night/admin.js'),
    '/api/movie-night/capacity': () => import('./api/movie-night/capacity.js'),
    '/api/movie-night/orders': () => import('./api/movie-night/orders.js'),
    '/api/movie-night/receipt-upload': () => import('./api/movie-night/receipt-upload.js'),
    '/api/movie-night/status': () => import('./api/movie-night/status.js'),
    '/api/movie-night/ticket-qr': () => import('./api/movie-night/ticket-qr.js'),
  }

  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost')
        const loadHandler = handlers[url.pathname]
        if (!loadHandler) return next()

        try {
          const chunks = []
          let size = 0
          for await (const chunk of req) {
            size += chunk.length
            if (size > 64 * 1024) {
              res.statusCode = 413
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ error: 'That request is too large.' }))
              return
            }
            chunks.push(chunk)
          }

          const rawBody = Buffer.concat(chunks).toString('utf8')
          req.body = rawBody ? JSON.parse(rawBody) : undefined
          req.query = Object.fromEntries(url.searchParams)
          const originalSetHeader = res.setHeader.bind(res)
          res.status = status => {
            res.statusCode = status
            return res
          }
          res.setHeader = (name, value) => {
            originalSetHeader(name, value)
            return res
          }

          const { default: handler } = await loadHandler()
          await handler(req, res)
        } catch (error) {
          server.config.logger.error(`Local API request failed: ${error.message}`)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: 'The request could not be completed.' }))
          }
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    plugins: [react(), localApi()],
  }
})
