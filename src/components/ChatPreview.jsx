// src/components/ChatPreview.jsx
// Animated chat window — fixed: all timeouts tracked & cleared on unmount

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Globe } from 'lucide-react'

const CONVERSATION = [
  { role: 'user', text: 'What\'s the latest in AI today?' },
  { role: 'ai',   text: 'New Cerebras model updates just dropped — let me search for the latest.', web: true },
  { role: 'user', text: 'How does NeuraChat use web search?' },
  { role: 'ai',   text: 'I call the web_search tool automatically when your question needs live data — prices, news, or recent releases.' },
  { role: 'user', text: 'What is LSTM?' },
  { role: 'ai',   text: 'LSTM (Long Short-Term Memory) is an RNN variant that captures long-range sequential dependencies — ideal for NLP tasks.' },
  { role: 'user', text: 'Current Bitcoin price?' },
  { role: 'ai',   text: 'Searching live markets now for the current BTC price…', web: true },
]

export default function ChatPreview() {
  const [visible, setVisible] = useState([])
  const [typing,  setTyping]  = useState(false)
  const timers    = useRef([])
  const cancelled = useRef(false)

  useEffect(() => {
    cancelled.current = false
    let idx = 0

    const after = (ms, fn) => {
      if (cancelled.current) return
      const id = setTimeout(() => { if (!cancelled.current) fn() }, ms)
      timers.current.push(id)
    }

    const addNext = () => {
      if (cancelled.current) return
      if (idx >= CONVERSATION.length) {
        idx = 0
        setVisible([])
        after(1000, addNext)
        return
      }
      const msg = CONVERSATION[idx]
      if (msg.role === 'ai') {
        setTyping(true)
        after(1100, () => {
          setTyping(false)
          setVisible(v => [...v, msg])
          idx++
          after(1600, addNext)
        })
      } else {
        setVisible(v => [...v, msg])
        idx++
        after(900, addNext)
      }
    }

    after(600, addNext)

    return () => {
      cancelled.current = true
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-brand-500/10 rounded-3xl blur-3xl scale-110 pointer-events-none" />

      <div className="relative glass-strong rounded-2xl overflow-hidden border border-white/10 shadow-glass">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/6 bg-white/3">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <div className="flex-1 flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
            <Bot size={12} className="text-brand-400" />
            NeuraChat · Cerebras + Web Search
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Messages */}
        <div className="p-5 flex flex-col gap-4 min-h-[340px] max-h-[420px] overflow-hidden">
          <AnimatePresence mode="popLayout">
            {visible.slice(-5).map((msg, i) => (
              <motion.div
                key={`msg-${i}-${msg.role}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
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
                  {msg.role === 'ai' && msg.web && (
                    <div className="flex items-center gap-1 text-[10px] text-brand-400/70 mb-1">
                      <Globe size={9} />
                      <span className="font-mono">web search</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {typing && (
              <motion.div
                key="typing-indicator"
                initial={{ opacity: 0, y: 10 }}
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
        </div>

        {/* Input bar */}
        <div className="px-5 pb-5">
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 border border-white/8">
            <span className="text-sm text-zinc-600 flex-1 font-mono cursor-blink">Ask me anything…</span>
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-sm">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white"
                   strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 border border-brand-500/20 shadow-glass"
      >
        <div className="text-xs font-mono text-brand-300">Cerebras API</div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 border border-brand-500/20 shadow-glass"
      >
        <div className="text-xs font-mono text-brand-300 flex items-center gap-1">
          <Globe size={10} /> Live web search
        </div>
      </motion.div>
    </div>
  )
}
