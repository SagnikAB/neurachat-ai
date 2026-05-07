# NeuraChat v3 — API Setup

## Adding Your Cerebras API Key

NeuraChat uses the **Cerebras API with real-time web search** instead of a local LSTM model.
No Python backend or model training needed.

### Local development

Create a `.env` file in the project root:

```
VITE_CEREBRAS_API_KEY=your-cerebras-key
```

Then update the fetch call in `src/components/LiveDemo.jsx` to include the key header:

```js
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_CEREBRAS_API_KEY}`,
},
```

### Vercel deployment

1. Go to your project in the Vercel dashboard
2. Settings → Environment Variables
3. Add `VITE_CEREBRAS_API_KEY` with your key value
4. Redeploy

### Recommended: Proxy via Vercel API route (production)

To keep your key out of the browser bundle, create `api/chat.js`:

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify(req.body),
  })

  const data = await response.json()
  res.status(response.status).json(data)
}
```

Then in `LiveDemo.jsx`, change the fetch URL from
`https://api.cerebras.ai/v1/chat/completions` to `/api/chat`
and remove the direct `Authorization` header — it's now handled server-side.

Add `CEREBRAS_API_KEY` (no `VITE_` prefix) to Vercel env vars.
