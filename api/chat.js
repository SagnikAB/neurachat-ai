// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Debug: temporarily log to confirm key is present
  console.log('Key present:', !!process.env.CEREBRAS_API_KEY)

  const upstream = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify(req.body),
  })

  const data = await upstream.json()
  return res.status(upstream.status).json(data)
}