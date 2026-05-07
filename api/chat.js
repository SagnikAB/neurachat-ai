// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse body if it's a string (Vercel sometimes doesn't auto-parse)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const upstream = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const data = await upstream.json()
    return res.status(upstream.status).json(data)

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: err.message })
  }
}