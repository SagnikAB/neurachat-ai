# NeuraChat

Modern AI chatbot landing page + live chat demo built with React and deployed on Vercel.

## Overview

This project uses:
- A Vite + React frontend (`src/`)
- A Vercel serverless API route (`api/chat.js`)
- Cerebras Chat Completions API as the model provider

The frontend sends chat requests to `/api/chat`, and the server route forwards them to Cerebras using your server-side API key.

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS
- Framer Motion
- Vercel Serverless Functions

## Project Structure

```txt
chatbot-saas/
├─ api/
│  ├─ chat.js
│  └─ chat/
│     └─ index.js
├─ public/
├─ src/
│  ├─ components/
│  ├─ utils/
│  ├─ App.jsx
│  └─ main.jsx
├─ vercel.json
├─ package.json
└─ README.md
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
CEREBRAS_API_KEY=your_key_here
```

3. Run locally with Vercel routing + functions:

```bash
npx vercel dev
```

4. Open:

```txt
http://localhost:3000
```

Note: `npm run dev` starts only Vite. For API route testing (`/api/chat`), prefer `vercel dev`.

## Deployment (Vercel)

1. Import this repo into Vercel.
2. Set project Root Directory to the repository root.
3. Add environment variable:
   - `CEREBRAS_API_KEY`
4. Redeploy.

### Required env vars

- `CEREBRAS_API_KEY` (server-side, required)

## API Route

### `POST /api/chat`

Proxy endpoint for Cerebras chat completions.

Request body (OpenAI-compatible):

```json
{
  "model": "llama-3.3-70b",
  "messages": [
    { "role": "system", "content": "You are helpful." },
    { "role": "user", "content": "Hello" }
  ],
  "max_tokens": 1024
}
```

Behavior:
- Validates request shape
- Uses server env key
- Retries with fallback models if requested model is unavailable
- Returns upstream response/error

## Common Errors and Fixes

### `404 /api/chat` or `404 /api/chat.js`

- Ensure latest commit is deployed.
- Verify Vercel Root Directory points to this project root.
- Confirm `api/chat.js` exists in deployed branch.
- Hard refresh browser after deployment.

### `401 Unauthorized`

- `CEREBRAS_API_KEY` missing/invalid in Vercel.
- Re-add key and redeploy.

### `404 model_not_found`

- Requested model is not available for your account.
- Use supported models such as:
  - `llama-3.3-70b`
  - `llama3.1-70b`
  - `llama3.1-8b`

### Frontend works but chat falls back

- API is unreachable or upstream timed out.
- Check browser network tab and Vercel function logs.

## Scripts

```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## License

MIT
