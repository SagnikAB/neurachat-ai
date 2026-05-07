// src/components/LiveDemo.jsx
// Full-featured chatbot — Claude API with web search, rich markdown, copy, timestamps

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, RotateCcw, Globe, Zap, Copy, Check } from 'lucide-react'

const CLAUDE_MODEL  = 'claude-sonnet-4-20250514'
const MAX_TOKENS    = 2048
const SYSTEM_PROMPT = `You are NeuraChat, a highly capable AI assistant powered by Claude.
You can help with absolutely anything — coding, math, science, history, philosophy, creative writing,
recipes, advice, travel, finance, health questions, language translation, debugging, brainstorming,
jokes, and everything in between. You have access to real-time web search — use it automatically
whenever the user asks about current events, recent news, live prices, sports scores, new releases,
or any fact that may have changed recently. Be thorough yet concise, friendly, and conversational.
Use markdown formatting when it helps clarity (bullet points, numbered lists, code blocks, bold text, headings).
Never refuse a reasonable request. Always try your best to help.`

const SUGGESTIONS = [
  '✍️ Write a poem about space',
  '⚛️ Explain quantum computing',
  '₿ Current Bitcoin price?',
  '🍝 Lasagna recipe',
  '🐛 Debug: console.log(1 + "2")',
  '🗾 Best spots in Japan?',
  '📰 What\'s in the news today?',
  '😂 Tell me a joke',
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

  return { text: text.trim() || 'No response generated.', usedSearch, raw: data.content }
}

// ── Inline renderer: **bold**, *italic*, `code` ────────────────────────────
function inlineRender(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="text-zinc-300 italic">{part.slice(1, -1)}</em>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="bg-white/10 text-brand-300 px-1 py-0.5 rounded text-[11px] font-mono">{part.slice(1, -1)}</code>
    return part
  })
}

// ── Full markdown block renderer ───────────────────────────────────────────
function MarkdownBlock({ text }) {
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <div key={`code-${i}`} className="my-2 rounded-lg overflow-hidden border border-white/10">
          {lang && (
            <div className="px-3 py-1 bg-white/5 border-b border-white/8">
              <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider">{lang}</span>
            </div>
          )}
          <pre className="p-3 text-[12px] font-mono text-zinc-200 overflow-x-auto leading-relaxed bg-black/30">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      )
      i++
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(<p key={i} className="font-semibold text-white text-sm mt-3 mb-0.5">{inlineRender(line.slice(4))}</p>)
      i++; continue
    }
    if (line.startsWith('## ')) {
      elements.push(<p key={i} className="font-bold text-white text-base mt-3 mb-1">{inlineRender(line.slice(3))}</p>)
      i++; continue
    }
    if (line.startsWith('# ')) {
      elements.push(<p key={i} className="font-bold text-white text-lg mt-3 mb-1">{inlineRender(line.slice(2))}</p>)
      i++; continue
    }

    // Bullet list
    if (line.match(/^[-*] /)) {
      const items = []
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-1.5 flex flex-col gap-0.5 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-brand-400 mt-1.5 flex-shrink-0 text-[7px]">●</span>
              <span>{inlineRender(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const items = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-1.5 flex flex-col gap-0.5 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-brand-400 flex-shrink-0 font-mono text-[11px] mt-0.5 w-4">{idx + 1}.</span>
              <span>{inlineRender(item)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // HR
    if (line.match(/^---+$/)) {
      elements.push(<hr key={i} className="border-white/10 my-2" />)
      i++; continue
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />)
      i++; continue
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-sm leading-relaxed">{inlineRender(line)}</p>
    )
    i++
  }

  return <div className="flex flex-col gap-0.5">{elements}</div>
}

// ── Copy button ────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150
                 p-1 rounded-md hover:bg-white/10 text-zinc-600 hover:text-zinc-300"
      title="Copy"
    >
      {copied
        ? <Check size={11} className="text-brand-400" />
        : <Copy size={11} />}
    </button>
  )
}

// ── Timestamp ──────────────────────────────────────────────────────────────
function Timestamp({ ts }) {
  const d = new Date(ts)
  return (
    <span className="text-[10px] text-zinc-700 font-mono select-none">
      {d.getHours().toString().padStart(2,'0')}:{d.getMinutes().toString().padStart(2,'0')}
    </span>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function LiveDemo() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hey! I'm NeuraChat — ask me literally anything. Code, math, recipes, travel, news, jokes, debugging... I've got you 🤙",
      id: 0,
      ts: Date.now(),
      usedSearch: false,
    },
  ])
  const [history, setHistory]             = useState([])
  const [input, setInput]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef                         = useRef(null)
  const inputRef                          = useRef(null)
  const ref                               = useRef(null)
  const isInView                          = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const addMsg = (role, text, usedSearch = false) =>
    setMessages(prev => [...prev, { role, text, usedSearch, ts: Date.now(), id: Date.now() + Math.random() }])

  const send = useCallback(async (text) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setError('')
    setLoading(true)
    setShowSuggestions(false)
    addMsg('user', msg)

    if (inputRef.current) inputRef.current.style.height = '42px'

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
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [input, loading, history])

  const reset = () => {
    setMessages([{
      role: 'ai',
      text: "Fresh start! Ask me anything — I mean it, anything at all 🙂",
      id: Date.now(),
      ts: Date.now(),
      usedSearch: false,
    }])
    setHistory([])
    setInput('')
    setError('')
    setShowSuggestions(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const isNearLimit = input.length > 1800

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
            <Zap size={10} className="fill-brand-400" /> Live Demo
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-700 tracking-tight text-white mb-4">
            Chat with <span className="text-gradient">NeuraChat</span>
          </h2>
          <p className="text-zinc-400">
            Ask anything — coding, news, recipes, math, creative writing, and more
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
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30
                                flex items-center justify-center">
                  <Bot size={16} className="text-brand-300" />
                </div>
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-400
                                 rounded-full border-2 border-surface" />
              </div>
              <div>
                <div className="text-sm font-display font-600 text-white">NeuraChat</div>
                <div className="text-xs text-zinc-500 font-mono">
                  Answers anything · Web search on
                </div>
              </div>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200
                         transition-all p-1.5 px-3 rounded-lg hover:bg-white/5 font-mono
                         border border-transparent hover:border-white/10"
            >
              <RotateCcw size={12} /> New chat
            </button>
          </div>

          {/* Messages */}
          <div className="h-[480px] overflow-y-auto px-4 py-5 flex flex-col gap-1 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={`group flex items-start gap-2.5 px-1 py-1
                    ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center
                                   justify-center mt-0.5
                    ${msg.role === 'ai'
                      ? 'bg-brand-500/20 border border-brand-500/30'
                      : 'bg-zinc-700 border border-zinc-600'}`}>
                    {msg.role === 'ai'
                      ? <Bot  size={12} className="text-brand-300" />
                      : <User size={12} className="text-zinc-300" />}
                  </div>

                  {/* Bubble + meta */}
                  <div className={`flex flex-col gap-1 max-w-[80%]
                    ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

                    {msg.role === 'ai' && msg.usedSearch && (
                      <div className="flex items-center gap-1 text-[10px] text-brand-400/80
                                      bg-brand-500/10 border border-brand-500/20 px-2 py-0.5
                                      rounded-full font-mono">
                        <Globe size={8} /> searched the web
                      </div>
                    )}

                    <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                      {msg.role === 'ai'
                        ? <MarkdownBlock text={msg.text} />
                        : <span className="text-sm leading-relaxed">{msg.text}</span>}
                    </div>

                    <div className={`flex items-center gap-1.5
                      ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Timestamp ts={msg.ts} />
                      {msg.role === 'ai' && <CopyButton text={msg.text} />}
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 px-1 py-1"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30
                                  flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={12} className="text-brand-300" />
                  </div>
                  <div className="chat-bubble-ai flex items-center gap-1.5 py-3 px-4">
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
                className="mx-4 mb-2 px-3 py-2.5 text-xs text-red-400 bg-red-500/8
                           border border-red-500/20 rounded-xl font-mono flex items-start gap-2"
              >
                <span className="flex-shrink-0">⚠</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions — disappear after first message */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 pb-3 pt-3 border-t border-white/5 overflow-hidden"
              >
                <p className="text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-wider">
                  Try asking…
                </p>
                <div className="flex gap-2 flex-wrap">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={loading}
                      className="text-xs font-mono text-zinc-400 bg-white/4 border border-white/8
                                 px-3 py-1.5 rounded-lg hover:bg-brand-500/15 hover:text-brand-300
                                 hover:border-brand-500/30 transition-all duration-200
                                 disabled:opacity-40 whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                             text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-none
                             focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/15
                             transition-all font-body disabled:opacity-50 leading-relaxed
                             min-h-[42px] max-h-[120px] overflow-y-auto"
                  style={{ height: '42px' }}
                />
                {isNearLimit && (
                  <span className="absolute right-3 bottom-2.5 text-[10px] font-mono text-zinc-600">
                    {input.length}/2000
                  </span>
                )}
              </div>

              <motion.button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex-shrink-0 rounded-xl bg-brand-500 hover:bg-brand-400
                           flex items-center justify-center transition-all duration-200
                           disabled:opacity-30 disabled:cursor-not-allowed shadow-glow-sm
                           hover:shadow-glow-md"
              >
                <Send size={15} className="text-white" />
              </motion.button>
            </div>

            <div className="flex items-center justify-between mt-2 px-0.5">
              <span className="text-[10px] text-zinc-700 font-mono">
                Enter ↵ send · Shift+Enter new line
              </span>
              <span className="text-[10px] text-zinc-700 font-mono flex items-center gap-1">
                <Globe size={8} /> Web search · ⚡ {CLAUDE_MODEL}
              </span>
            </div>
          </div>
        </motion.div>

        {/* API key note */}
        <p className="text-center text-xs text-zinc-600 font-mono mt-5">
          Requires{' '}
          <code className="text-brand-500/80">VITE_ANTHROPIC_API_KEY</code>
          {' '}in your <code className="text-brand-500/80">.env</code> — see README for setup
        </p>
      </div>
    </section>
  )
}
