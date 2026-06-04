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
    const messages = body?.messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request body: messages array is required.' })
    }

    const fallbackModels = ['gpt-oss-120b', 'zai-glm-4.7']
    const requestedModel = body?.model
    const modelsToTry = [
      requestedModel,
      ...fallbackModels.filter((m) => m !== requestedModel),
    ].filter(Boolean)

    let lastStatus = 500
    let lastData = { error: 'Unknown upstream error.' }

    for (const model of modelsToTry) {
      const { max_tokens: legacyMaxTokens, ...restBody } = body
      const requestBody = {
        ...restBody,
        model,
        max_completion_tokens: body.max_completion_tokens ?? legacyMaxTokens,
      }
      const upstream = await fetch(
        'https://api.cerebras.ai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(18000),
        },
      )

      const contentType = upstream.headers.get('content-type') || ''
      const data = contentType.includes('application/json')
        ? await upstream.json()
        : { error: await upstream.text() }

      if (upstream.ok) {
        return res.status(200).json(data)
      }

      lastStatus = upstream.status
      lastData = data

      const modelNotFound = upstream.status === 404
        && (data?.code === 'model_not_found'
          || data?.type === 'not_found_error'
          || String(data?.message || data?.error || '').toLowerCase().includes('model'))

      if (!modelNotFound) {
        return res.status(upstream.status).json(data)
      }
    }

    return res.status(lastStatus).json(lastData)

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: err.message })
  }
}
