// src/components/Features.jsx
// Six-card feature grid with hover effects and icons

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Brain, Globe, Zap, Database,
  Shield, RefreshCw,
} from 'lucide-react'
import { staggerContainer, fadeUp } from '../utils/animations.js'

const FEATURES = [
  {
    icon: Brain,
    color: 'from-brand-500/20 to-brand-700/10',
    border: 'border-brand-500/20',
    iconColor: 'text-brand-300',
    title: 'Model-Powered Intelligence',
    desc: 'Built on the Cerebras API to deliver nuanced, context-aware responses across domains with strong multi-turn conversation memory.',
  },
  {
    icon: Globe,
    color: 'from-violet-500/20 to-violet-700/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-300',
    title: 'Real-Time Web Search',
    desc: 'Integrated web search tool fires automatically when queries require current data — news, prices, scores, releases — going beyond static training knowledge.',
  },
  {
    icon: Zap,
    color: 'from-amber-500/20 to-amber-700/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-300',
    title: 'Sub-500ms Responses',
    desc: 'Direct API integration with streaming support delivers fast, fluid replies. No intermediate servers, no extra hops — just clean request-response cycles.',
  },
  {
    icon: Database,
    color: 'from-cyan-500/20 to-cyan-700/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-300',
    title: 'Full Conversation Memory',
    desc: 'The complete message history is sent with every request, enabling genuine multi-turn conversations where the AI remembers context across the entire session.',
  },
  {
    icon: Shield,
    color: 'from-rose-500/20 to-rose-700/10',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-300',
    title: 'No Hallucinations on Facts',
    desc: 'When web search is triggered, answers are grounded in live sources. The model cites retrieved content rather than guessing, dramatically reducing factual errors.',
  },
  {
    icon: RefreshCw,
    color: 'from-emerald-500/20 to-emerald-700/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-300',
    title: 'Drop-in Upgradeable',
    desc: 'Swap the system prompt, change the model string, or add MCP tools — the architecture is fully composable so your AI agent grows with your product.',
  },
]

function FeatureCard({ feature, index }) {
  const Icon = feature.icon
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.05}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative glass rounded-2xl p-6 border ${feature.border}
                  overflow-hidden cursor-default transition-shadow duration-300
                  hover:shadow-glass`}
    >
      {/* Card gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0
                       group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl bg-white/5 border border-white/8
                         flex items-center justify-center mb-5 transition-transform
                         duration-300 group-hover:scale-110`}>
          <Icon size={20} className={feature.iconColor} />
        </div>

        <h3 className="font-display font-600 text-lg text-white mb-2 leading-snug">
          {feature.title}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {feature.desc}
        </p>
      </div>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" className="py-28 px-6 lg:px-10" ref={ref}>
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-mono text-brand-400 tracking-widest
                           uppercase mb-4 border border-brand-500/20 px-4 py-1 rounded-full glass">
            Core Capabilities
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-700 tracking-tight
                         text-white mb-4">
            Built for Developers,{' '}
            <span className="text-gradient">Powered by Cerebras</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Every component is engineered for production: real AI, live web data,
            and a composable architecture you can extend in minutes.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
