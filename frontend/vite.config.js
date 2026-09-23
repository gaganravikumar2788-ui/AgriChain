import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function farmerSyncPlugin() {
  const dbPath = path.resolve(__dirname, '../registered_farmers.json')

  const readDb = () => {
    try {
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, 'utf-8')
        return JSON.parse(raw)
      }
    } catch (e) {
      console.warn('Error reading registered_farmers.json:', e)
    }
    return []
  }

  const writeDb = (data) => {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
      console.warn('Error writing registered_farmers.json:', e)
    }
  }

  const usersDbPath = path.resolve(__dirname, '../registered_users.json')

  const readUsersDb = () => {
    try {
      let users = []
      if (fs.existsSync(usersDbPath)) {
        users = JSON.parse(fs.readFileSync(usersDbPath, 'utf-8'))
      }
      // Guarantee farmers from registered_farmers.json are also included
      const farmers = readDb()
      farmers.forEach(f => {
        const clean = String(f.phone || f.mobile || '').replace(/[^0-9]/g, '').slice(-10)
        if (clean && !users.some(u => String(u.mobile || u.phone || '').replace(/[^0-9]/g, '').slice(-10) === clean)) {
          users.push({
            id: f.id,
            role: 'FARMER',
            name: f.name,
            mobile: f.phone || f.mobile,
            cleanMobile: clean,
            district: f.district,
            registeredAt: f.registeredAt
          })
        }
      })
      return users
    } catch (e) {
      console.warn('Error reading registered_users.json:', e)
      return []
    }
  }

  const writeUsersDb = (data) => {
    try {
      fs.writeFileSync(usersDbPath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
      console.warn('Error writing registered_users.json:', e)
    }
  }

  return {
    name: 'farmer-sync-plugin',
    configureServer(server) {
      // 1. Registered Users Endpoint
      server.middlewares.use('/api/users', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method === 'GET') {
          const list = readUsersDb()
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify(list))
          return
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const record = JSON.parse(body)
              const list = readUsersDb()
              const cleanDigits = String(record.mobile || record.phone || '').replace(/[^0-9]/g, '').slice(-10)
              
              const existingIdx = list.findIndex(u => {
                const uClean = String(u.mobile || u.phone || '').replace(/[^0-9]/g, '').slice(-10)
                return uClean && cleanDigits && uClean === cleanDigits
              })

              if (existingIdx >= 0) {
                const existing = list[existingIdx]
                const sameRole = existing.role === record.role || 
                  ((existing.role === 'BUYER' || existing.role === 'BULK_BUYER') && (record.role === 'BUYER' || record.role === 'BULK_BUYER'))

                if (!sameRole) {
                  res.statusCode = 409
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({
                    error: 'ROLE_CONFLICT',
                    existingUser: existing,
                    message: `User already registered as ${existing.role}`
                  }))
                  return
                }
                list[existingIdx] = { ...existing, ...record }
              } else {
                list.unshift(record)
              }

              writeUsersDb(list)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, count: list.length, user: record }))
            } catch (err) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        next()
      })

      // 2. Registered Farmers Endpoint
      server.middlewares.use('/api/farmers', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method === 'GET') {
          const list = readDb()
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify(list))
          return
        }

        if (req.method === 'DELETE') {
          writeDb([])
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify({ success: true, count: 0, list: [] }))
          return
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const record = JSON.parse(body)
              const list = readDb()
              const existingIdx = list.findIndex(f => f.id === record.id || (record.phone && f.phone === record.phone))
              if (existingIdx >= 0) {
                list[existingIdx] = { ...list[existingIdx], ...record }
              } else {
                list.unshift(record)
              }
              writeDb(list)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, count: list.length, list }))
            } catch (err) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        next()
      })

      // 3. Multilingual Speech Proxy Endpoint (Kannada, Hindi, English)
      server.middlewares.use('/api/tts', async (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        try {
          const parsedUrl = new URL(req.url, 'http://localhost:5173')
          const tl = parsedUrl.searchParams.get('tl') || 'kn'
          const q = parsedUrl.searchParams.get('q') || ''

          if (!q.trim()) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Text parameter "q" is required' }))
            return
          }

          const lang = tl === 'hi' ? 'hi' : tl === 'kn' ? 'kn' : 'en'
          const cleanText = q.trim().slice(0, 200)
          const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(cleanText)}`

          const upstreamRes = await fetch(googleUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          })

          if (!upstreamRes.ok) {
            res.statusCode = upstreamRes.status
            res.end()
            return
          }

          const buffer = Buffer.from(await upstreamRes.arrayBuffer())
          res.setHeader('Content-Type', 'audio/mpeg')
          res.setHeader('Content-Length', buffer.length)
          res.setHeader('Cache-Control', 'public, max-age=86400')
          res.statusCode = 200
          res.end(buffer)
        } catch (err) {
          console.error('Vite TTS proxy error:', err)
          res.statusCode = 500
          res.end()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    farmerSyncPlugin(),
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
})
