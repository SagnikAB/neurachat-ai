// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const apiKey =
      process.env.CEREBRAS_API_KEY ||
      process.env.CEREBRAS_API_TOKEN ||
      process.env.VITE_CEREBRAS_API_KEY

    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing Cerebras API key on server. Set CEREBRAS_API_KEY in Vercel environment variables.',
      })
    }

    // Parse body if it's a string (Vercel sometimes doesn't auto-parse)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const upstream = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const contentType = upstream.headers.get('content-type') || ''
    const data = contentType.includes('application/json')
      ? await upstream.json()
      : { error: await upstream.text() }

    return res.status(upstream.status).json(data)

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: err.message })
  }
}