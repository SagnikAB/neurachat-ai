import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import chatHandler from './api/chat.js'

function localApiPlugin() {
  return {
    name: 'local-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]
        if (pathname !== '/api/chat' && pathname !== '/api/chat.js') {
          next()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let rawBody = ''
        req.on('data', (chunk) => {
          rawBody += chunk
        })

        req.on('end', async () => {
          try {
            const vercelReq = {
              ...req,
              body: rawBody ? JSON.parse(rawBody) : {},
            }
            const vercelRes = {
              status(code) {
                res.statusCode = code
                return this
              },
              json(data) {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
                return this
              },
            }

            await chatHandler(vercelReq, vercelRes)
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: error.message }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), localApiPlugin()],
  }
})
