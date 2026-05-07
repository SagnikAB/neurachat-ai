# NeuraChat — AI Conversational Agent

> An AI-powered chatbot built with **Python**, **NLTK**, **LSTM (TensorFlow/Keras)**, and a **React + Tailwind CSS** frontend. Deployable to Vercel in under 30 minutes.

![MIT License](https://img.shields.io/badge/license-MIT-green)
![Python 3.11](https://img.shields.io/badge/Python-3.11-blue)
![React 18](https://img.shields.io/badge/React-18-61DAFB)
![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

---

## 🧠 Architecture

```
User Input
    │
    ▼
NLTK Preprocessing (tokenize → lemmatize → bag-of-words)
    │
    ▼
LSTM Model (TensorFlow/Keras) → Intent Classification
    │
    ▼
Response Retrieval (JSON intent pool)
    │
    ▼
API Response (FastAPI)
```

---

## 📁 Project Structure

```
neurachat-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky glassmorphism navbar
│   │   ├── Hero.jsx            # Full-screen hero section
│   │   ├── ChatPreview.jsx     # Animated chat widget (hero)
│   │   ├── Features.jsx        # 6-card feature grid
│   │   ├── HowItWorks.jsx      # 3-step pipeline explanation
│   │   ├── Stats.jsx           # Animated statistics counters
│   │   ├── LiveDemo.jsx        # Interactive chatbot demo
│   │   ├── TechStack.jsx       # Marquee tech logos
│   │   ├── Testimonials.jsx    # Review cards
│   │   ├── CTA.jsx             # Final call-to-action
│   │   └── Footer.jsx          # Site footer
│   ├── utils/
│   │   └── animations.js       # Framer Motion variants
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                 # Vercel deployment config
└── package.json
```

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/neurachat-ai.git
cd neurachat-ai

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open http://localhost:5173
```

---

## ☁️ Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B — GitHub Integration

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Click **Deploy** ✅

No environment variables required for the frontend.

---

## 🐍 Python Backend Setup (Optional)

For the real LSTM model (not the client-side demo):

```bash
cd backend/
pip install -r requirements.txt

# Train the model
python train.py --intents data/intents.json --epochs 200

# Start FastAPI server
uvicorn app:app --reload --port 8000
```

Update `src/components/LiveDemo.jsx` to call `http://localhost:8000/chat` instead of the local classifier.

---

## 🧾 Intent JSON Format

```json
{
  "intents": [
    {
      "tag": "greeting",
      "patterns": ["Hello", "Hi", "Hey", "Good morning"],
      "responses": ["Hello! How can I help?", "Hi there!"]
    }
  ]
}
```

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Tailwind CSS, Framer Motion |
| ML Model    | TensorFlow/Keras LSTM             |
| NLP         | NLTK (tokenize, lemmatize, BoW)   |
| Backend API | FastAPI + Uvicorn                 |
| Deployment  | Vercel (frontend), Railway/Render (API) |
| CI/CD       | GitHub Actions                    |

---

## 📄 License

MIT — free to use, modify, and deploy.
