// src/components/Stats.jsx
// Animated statistics counters with gradient backgrounds

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { staggerContainer, fadeUp } from '../utils/animations.js'

const STATS = [
  { value: 99.2, suffix: '%',  label: 'Response Accuracy',  note: 'Claude Sonnet benchmark'  },
  { value: 480,  suffix: 'ms', label: 'Avg Response Time',  note: 'Including web search p90'  },
  { value: 2400, suffix: '+',  label: 'Developers',         note: 'Using NeuraChat today'     },
  { value: 128,  suffix: 'k',  label: 'Context Window',     note: 'Tokens per conversation'   },
]

function useCountUp(target, isInView, decimals = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = target / 60
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(parseFloat(start.toFixed(decimals)))
    }, 18)
    return () => clearInterval(timer)
  }, [isInView, target, decimals])
  return count
}

function StatCard({ stat, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const decimals = stat.value % 1 !== 0 ? 1 : 0
  const count = useCountUp(stat.value, isInView, decimals)

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={index * 0.08}
      className="stat-card border border-white/8 hover:border-brand-500/25
                 transition-all duration-300 hover:shadow-glass group"
    >
      {/* BG glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      <div className="relative z-10">
        <div className="font-display text-5xl font-800 text-gradient mb-1">
          {count}{stat.suffix}
        </div>
        <div className="text-white font-600 text-base mb-1">{stat.label}</div>
        <div className="text-xs text-zinc-500 font-mono">{stat.note}</div>
      </div>
    </motion.div>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-20 px-6 lg:px-10" ref={ref}>
      <div className="max-w-7xl mx-auto">

        {/* Divider */}
        <div className="flex items-center gap-6 mb-16">
          <div className="flex-1 h-px bg-white/6" />
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest whitespace-nowrap">
            By the numbers
          </span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
        </motion.div>
      </div>
    </section>
  )
}
