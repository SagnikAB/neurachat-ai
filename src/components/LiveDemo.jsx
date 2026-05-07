// src/components/LiveDemo.jsx
// Full-featured chatbot — Cerebras API (OpenAI-compatible), ultra-fast inference

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, RotateCcw, Sparkles } from 'lucide-react'

const CEREBRAS_MODEL = 'zai-glm-4.7'
const SYSTEM_PROMPT  = `You are NeuraChat, a highly capable AI assistant powered by Cerebras.
You can help with absolutely anything — coding, math, science, history, philosophy, creative writing,
recipes, advice, travel, finance, health questions, language translation, debugging, brainstorming,
jokes, and everything in between. Be thorough yet concise, friendly, and conversational.
Use markdown-style formatting when it helps clarity (bullet points, code blocks, bold text).
Never refuse a reasonable request. Always try your best to help.`

const SUGGESTIONS = [
  'Write me a poem about space 🚀',
  'Explain quantum computing simply',
  'Give me a lasagna recipe',
  'Debug this: console.log(1 + "2")',
  'Best travel spots in Japan?',
  'Tell me a joke',
  'Explain recursion simply',
  'Write a Python web scraper',
]

async function callCerebras(history) {
  const payload = {
    model: CEREBRAS_MODEL,
    max_tokens: 2048,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
    ],
  }

  let res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (res.status === 404) {
    res = await fetch('/api/chat.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${res.status}`)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content?.trim() || 'No response generated.'
  return { text }
}
// Simple markdown-lite renderer: bold, inline code, line breaks
function renderText(text) {
  const lines = text.split('\n')
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return (
      <span key={li}>
        {parts.map((part, pi) => {
          if (part.startsWith('**') && part.endsWith('**'))
            return <strong key={pi} className="text-white font-600">{part.slice(2, -2)}</strong>
          if (part.startsWith('`') && part.endsWith('`'))
            return <code key={pi} className="bg-white/10 text-brand-300 px-1 py-0.5 rounded text-[11px] font-mono">{part.slice(1, -1)}</code>
          return part
        })}
        {li < lines.length - 1 && <br />}
      </span>
    )
  })
}

export default function LiveDemo() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hey! I'm NeuraChat — ask me literally anything. Code, math, recipes, travel tips, creative writing, debugging, or just random questions. Powered by Cerebras for ultra-fast responses 🤙",
      id: 0,
    },
  ])
  const [history, setHistory] = useState([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)
  const ref                   = useRef(null)
  const isInView              = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const addMsg = (role, text) =>
    setMessages(prev => [...prev, { role, text, id: Date.now() + Math.random() }])

  const send = async (text) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setError('')
    setLoading(true)
    addMsg('user', msg)

    const newHistory = [...history, { role: 'user', content: msg }]
    setHistory(newHistory)

    try {
      const { text: reply } = await callCerebras(newHistory)
      addMsg('ai', reply)
      setHistory(h => [...h, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e.message || 'Something went wrong. Check your API key.')
      setHistory(h => h.slice(0, -1))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const reset = () => {
    setMessages([{
      role: 'ai',
      text: "Fresh start! Ask me anything — I mean it, anything at all 🙂",
      id: Date.now(),
    }])
    setHistory([])
    setInput('')
    setError('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <section id="demo" className="py-28 px-6 lg:px-10" ref={ref}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-400
                           tracking-widest uppercase mb-4 border border-brand-500/20
                           px-4 py-1 rounded-full glass">
            <Sparkles size={10} /> Live Demo
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-700 tracking-tight text-white mb-4">
            Chat with <span className="text-gradient">NeuraChat</span>
          </h2>
          <p className="text-zinc-400">
            Ask anything — coding, recipes, math, creative writing, and more
          </p>
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-strong rounded-2xl border border-white/10 overflow-hidden shadow-glass"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6 bg-white/2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30
                              flex items-center justify-center">
                <Bot size={15} className="text-brand-300" />
              </div>
              <div>
                <div className="text-sm font-display font-600 text-white">NeuraChat</div>
                <div className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                  Online · Ultra-fast · Cerebras
                </div>
              </div>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300
                         transition-colors p-1.5 px-3 rounded-lg hover:bg-white/5 font-mono"
              title="New conversation"
            >
              <RotateCcw size={13} /> New chat
            </button>
          </div>

          {/* Messages */}
          <div className="h-[480px] overflow-y-auto px-5 py-5 flex flex-col gap-5 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5
                    ${msg.role === 'ai'
                      ? 'bg-brand-500/20 border border-brand-500/30'
                      : 'bg-zinc-700 border border-zinc-600'}`}>
                    {msg.role === 'ai'
                      ? <Bot  size={13} className="text-brand-300" />
                      : <User size={13} className="text-zinc-300" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[78%] ${msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}`}>
                    <span className="text-sm leading-relaxed">
                      {msg.role === 'ai' ? renderText(msg.text) : msg.text}
                    </span>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30
                                  flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={13} className="text-brand-300" />
                  </div>
                  <div className="chat-bubble-ai flex items-center gap-1.5 py-3">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mb-2 px-3 py-2 text-xs text-red-400 bg-red-500/10
                           border border-red-500/20 rounded-lg font-mono"
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestion chips */}
          <div className="px-4 pb-3 pt-3 border-t border-white/5 flex gap-2 flex-wrap">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={loading}
                className="text-xs font-mono text-brand-300 bg-brand-500/10 border border-brand-500/20
                           px-3 py-1.5 rounded-lg hover:bg-brand-500/20 transition-colors
                           disabled:opacity-40 whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
                onKeyDown={handleKey}
                placeholder="Ask me anything…"
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                           text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-none
                           focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30
                           transition-all font-body disabled:opacity-50 leading-relaxed
                           min-h-[42px] max-h-[120px] overflow-y-auto"
                style={{ height: '42px' }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 flex-shrink-0 rounded-xl bg-brand-500 hover:bg-brand-400
                           flex items-center justify-center transition-all duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-sm
                           hover:shadow-glow-md"
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-700 font-mono mt-2 text-center">
              Enter to send · Shift+Enter for new line · Powered by {CEREBRAS_MODEL}
            </p>
          </div>
        </motion.div>

        {/* API key note */}
        <p className="text-center text-xs text-zinc-600 font-mono mt-4">
          Requires{' '}
          <code className="text-brand-500/80">CEREBRAS_API_KEY</code>
          {' '}in your <code className="text-brand-500/80">.env</code> — see README for setup
        </p>
      </div>
    </section>
  )
}