// src/components/ChatPreview.jsx
// Animated chat window shown in the hero — cycles through messages

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Loader2 } from 'lucide-react'

const CONVERSATION = [
  { role: 'user', text: 'What is the capital of France?' },
  { role: 'ai',   text: 'The capital of France is Paris. It is the largest city in France, situated on the Seine River.' },
  { role: 'user', text: 'Can you tell me today\'s weather in Tokyo?' },
  { role: 'ai',   text: 'I\'m currently configured as a retrieval-based agent. For live weather, connect the weather intent module!' },
  { role: 'user', text: 'How does LSTM help in NLP?' },
  { role: 'ai',   text: 'LSTM networks capture long-range dependencies in sequences, making them ideal for understanding context in natural language processing tasks.' },
]

export default function ChatPreview() {
  const [visible, setVisible] = useState([])
  const [typing, setTyping]   = useState(false)

  useEffect(() => {
    let idx = 0
    const addNext = () => {
      if (idx >= CONVERSATION.length) { idx = 0; setVisible([]); }
      if (CONVERSATION[idx].role === 'ai') {
        setTyping(true)
        setTimeout(() => {
          setTyping(false)
          setVisible(v => [...v, CONVERSATION[idx]])
          idx++
          setTimeout(addNext, 1600)
        }, 1200)
      } else {
        setVisible(v => [...v, CONVERSATION[idx]])
        idx++
        setTimeout(addNext, 800)
      }
    }
    const t = setTimeout(addNext, 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute inset-0 bg-brand-500/10 rounded-3xl blur-3xl scale-110 pointer-events-none" />

      {/* Window chrome */}
      <div className="relative glass-strong rounded-2xl overflow-hidden border border-white/10 shadow-glass">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/6 bg-white/3">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <div className="flex-1 mx-4">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
              <Bot size={12} className="text-brand-400" />
              NeuraChat · LSTM Agent
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="p-5 flex flex-col gap-4 min-h-[340px] max-h-[420px] overflow-hidden">
          <AnimatePresence mode="popLayout">
            {visible.slice(-5).map((msg, i) => (
              <motion.div
                key={`${msg.text.slice(0,15)}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                  ${msg.role === 'ai'
                    ? 'bg-brand-500/20 border border-brand-500/30'
                    : 'bg-zinc-700 border border-zinc-600'}`}
                >
                  {msg.role === 'ai'
                    ? <Bot size={13} className="text-brand-300" />
                    : <User size={13} className="text-zinc-300" />}
                </div>

                {/* Bubble */}
                <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <motion.div
                key="typing"
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
            <span className="text-sm text-zinc-600 flex-1 font-mono cursor-blink">
              Ask me anything…
            </span>
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center
                            shadow-glow-sm cursor-pointer hover:bg-brand-400 transition-colors">
              <ArrowRight size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating metric badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 border border-brand-500/20 shadow-glass"
      >
        <div className="text-xs font-mono text-brand-300">98.4% accuracy</div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 border border-brand-500/20 shadow-glass"
      >
        <div className="text-xs font-mono text-brand-300">&lt;120ms response</div>
      </motion.div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function ArrowRight({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         className={className} stroke="currentColor" strokeWidth={2.5}
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
