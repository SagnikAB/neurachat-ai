// src/components/LiveDemo.jsx
// Real AI demo — Claude API with web search tool, styled to match NeuraChat theme

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, RotateCcw, Globe } from 'lucide-react'

const CLAUDE_MODEL   = 'claude-sonnet-4-20250514'
const MAX_TOKENS     = 1024
const SYSTEM_PROMPT  = `You are NeuraChat, an intelligent AI assistant built by Sagnik using Claude.
You have access to real-time web search. Use it automatically when the user asks about:
- Current events, news, or prices
- Recent releases, updates, or scores
- Any fact that may have changed recently
Be concise (under 250 words), accurate, and conversational. Format clearly.`

const SUGGESTIONS = [
  'Latest AI news today',
  'What is LSTM?',
  'Explain NLTK',
  'Current Bitcoin price',
  'Best Python NLP libraries',
]

async function callClaude(messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${res.status}`)
  }

  const data = await res.json()
  let text = ''
  let usedSearch = false

  for (const block of data.content) {
    if (block.type === 'text') text += block.text
    if (block.type === 'tool_use' && block.name === 'web_search') usedSearch = true
  }

  return {
    text: text.trim() || 'No response generated.',
    usedSearch,
    raw: data.content,
  }
}

export default function LiveDemo() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm NeuraChat — now powered by Claude with real-time web search. Ask me anything about AI, Python, NLP, or what's happening in the world right now.",
      id: 0,
      usedSearch: false,
    },
  ])
  const [history, setHistory]   = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const bottomRef               = useRef(null)
  const inputRef                = useRef(null)
  const ref                     = useRef(null)
  const isInView                = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const addMsg = (role, text, usedSearch = false) =>
    setMessages(prev => [...prev, { role, text, usedSearch, id: Date.now() + Math.random() }])

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
      const { text: reply, usedSearch, raw } = await callClaude(newHistory)
      addMsg('ai', reply, usedSearch)
      setHistory(h => [...h, { role: 'assistant', content: raw }])
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
      text: 'Conversation reset! Ask me anything.',
      id: Date.now(),
      usedSearch: false,
    }])
    setHistory([])
    setInput('')
    setError('')
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
          <span className="inline-block text-xs font-mono text-brand-400 tracking-widest
                           uppercase mb-4 border border-brand-500/20 px-4 py-1 rounded-full glass">
            Live Demo
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-700 tracking-tight text-white mb-4">
            Chat with <span className="text-gradient">NeuraChat</span>
          </h2>
          <p className="text-zinc-400">
            Powered by Claude · Real-time web search · Multi-turn memory
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
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-white/2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30
                              flex items-center justify-center">
                <Bot size={15} className="text-brand-300" />
              </div>
              <div>
                <div className="text-sm font-display font-600 text-white">NeuraChat Agent</div>
                <div className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                  Claude · Web Search enabled
                </div>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-lg
                         hover:bg-white/5"
              title="Reset conversation"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto px-5 py-5 flex flex-col gap-4 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                    ${msg.role === 'ai'
                      ? 'bg-brand-500/20 border border-brand-500/30'
                      : 'bg-zinc-700 border border-zinc-600'}`}>
                    {msg.role === 'ai'
                      ? <Bot  size={13} className="text-brand-300" />
                      : <User size={13} className="text-zinc-300" />}
                  </div>

                  <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                    {msg.role === 'ai' && msg.usedSearch && (
                      <div className="flex items-center gap-1 text-[10px] text-brand-400/70 mb-1.5">
                        <Globe size={10} />
                        <span className="font-mono">web search used</span>
                      </div>
                    )}
                    <span className="whitespace-pre-wrap">{msg.text}</span>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30
                                  flex items-center justify-center flex-shrink-0">
                    <Bot size={13} className="text-brand-300" />
                  </div>
                  <div className="chat-bubble-ai flex items-center gap-1.5">
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
                className="mx-4 mb-1 px-3 py-2 text-xs text-red-400 bg-red-500/10
                           border border-red-500/20 rounded-lg font-mono"
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions */}
          <div className="px-5 pb-3 flex gap-2 flex-wrap border-t border-white/5 pt-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={loading}
                className="text-xs font-mono text-brand-300 bg-brand-500/10 border border-brand-500/20
                           px-3 py-1 rounded-lg hover:bg-brand-500/20 transition-colors disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Type your message…"
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                           text-sm text-zinc-200 placeholder-zinc-600 outline-none
                           focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30
                           transition-all font-body disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-400
                           flex items-center justify-center transition-all duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-sm
                           hover:shadow-glow-md"
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
          </div>

          {/* Footer badges */}
          <div className="px-5 pb-3 flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono text-zinc-600 flex items-center gap-1">
              <Globe size={9} /> Real-time web search
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-[10px] font-mono text-zinc-600">🧠 Multi-turn memory</span>
            <span className="text-zinc-700">·</span>
            <span className="text-[10px] font-mono text-zinc-600">⚡ {CLAUDE_MODEL}</span>
          </div>
        </motion.div>

        {/* API key note */}
        <p className="text-center text-xs text-zinc-600 font-mono mt-4">
          Requires{' '}
          <code className="text-brand-500/80">VITE_ANTHROPIC_API_KEY</code>
          {' '}in your <code className="text-brand-500/80">.env</code> — see README for setup
        </p>
      </div>
    </section>
  )
}
