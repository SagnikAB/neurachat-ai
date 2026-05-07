// src/components/LiveDemo.jsx
// Interactive demo chatbot that simulates AI responses client-side

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, RotateCcw } from 'lucide-react'

// Simulated intent responses (mirrors what the Python LSTM model would return)
const INTENT_RESPONSES = {
  greeting:  ['Hello! How can I assist you today?', 'Hi there! What can I help you with?'],
  farewell:  ['Goodbye! Have a great day!', 'See you soon! Take care.'],
  weather:   ['I can check the weather for you! Which city are you in?'],
  python:    ['Python is a high-level, interpreted programming language known for its readability and versatility.'],
  lstm:      ['LSTM (Long Short-Term Memory) is a type of recurrent neural network designed to learn long-term dependencies in sequential data.'],
  nltk:      ['NLTK (Natural Language Toolkit) is a Python library for working with human language data — tokenization, parsing, classification, and more.'],
  ml:        ['Machine Learning enables systems to learn from data and improve automatically without being explicitly programmed.'],
  default:   ['That\'s an interesting question! My LSTM model is still learning. Try asking about Python, NLTK, or LSTM.', 'I\'m not confident in my answer for that. Could you rephrase?'],
}

function classify(text) {
  const t = text.toLowerCase()
  if (/\b(hi|hello|hey|greetings)\b/.test(t)) return 'greeting'
  if (/\b(bye|goodbye|see you|farewell)\b/.test(t)) return 'farewell'
  if (/weather/.test(t)) return 'weather'
  if (/python/.test(t)) return 'python'
  if (/lstm/.test(t)) return 'lstm'
  if (/nltk/.test(t)) return 'nltk'
  if (/machine.?learn|ml\b/.test(t)) return 'ml'
  return 'default'
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const SUGGESTIONS = [
  'What is LSTM?', 'Explain NLTK', 'Hello!', 'What is Python?', 'Tell me about ML',
]

export default function LiveDemo() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I\'m NeuraChat — powered by LSTM + NLTK. Ask me anything about AI, Python, or NLP!', id: 0 }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef(null)
  const ref                   = useRef(null)
  const isInView              = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = (text) => {
    const msg = text ?? input.trim()
    if (!msg || loading) return
    setInput('')

    const userMsg = { role: 'user', text: msg, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    setTimeout(() => {
      const intent = classify(msg)
      const reply = pick(INTENT_RESPONSES[intent])
      setMessages(prev => [...prev, { role: 'ai', text: reply, id: Date.now() + 1 }])
      setLoading(false)
    }, 700 + Math.random() * 600)
  }

  const reset = () => {
    setMessages([{ role: 'ai', text: 'Conversation reset! Ask me anything.', id: Date.now() }])
    setInput('')
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
            Client-side intent classification — same logic as the Python LSTM model.
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
                  Online · LSTM model active
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
                      ? <Bot size={13} className="text-brand-300" />
                      : <User size={13} className="text-zinc-300" />}
                  </div>
                  <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                    {msg.text}
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
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Type your message…"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                           text-sm text-zinc-200 placeholder-zinc-600 outline-none
                           focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30
                           transition-all font-body"
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
        </motion.div>
      </div>
    </section>
  )
}
