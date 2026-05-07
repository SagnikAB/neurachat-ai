// src/components/TechStack.jsx
// Scrolling marquee — fixed: uses Framer Motion animate instead of CSS animation
// to avoid GPU layer thrashing that caused the black-out on Vercel

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const TECH = [
  { name: 'Cerebras API',    color: '#D97706' },
  { name: 'Python 3.11',     color: '#3776AB' },
  { name: 'Web Search',      color: '#22a666' },
  { name: 'React 18',        color: '#61DAFB' },
  { name: 'TensorFlow',      color: '#FF6F00' },
  { name: 'Tailwind CSS',    color: '#06B6D4' },
  { name: 'NLTK',            color: '#22a666' },
  { name: 'Framer Motion',   color: '#BB4FFF' },
  { name: 'FastAPI',         color: '#009688' },
  { name: 'Cerebras SDK',    color: '#D97706' },
  { name: 'NumPy',           color: '#4DABCF' },
  { name: 'Docker',          color: '#2496ED' },
  { name: 'Vercel',          color: '#ffffff' },
  { name: 'GitHub Actions',  color: '#2088FF' },
  { name: 'Keras',           color: '#D00000' },
  { name: 'Uvicorn',         color: '#8BC34A' },
]

// Pill chip component
function Chip({ item }) {
  return (
    <div className="flex items-center gap-2.5 glass border border-white/8 rounded-xl
                    px-5 py-3 whitespace-nowrap flex-shrink-0 select-none">
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
      <span className="text-sm font-mono text-zinc-300">{item.name}</span>
    </div>
  )
}

// One looping row — duplicates items to create seamless loop
function MarqueeRow({ items, direction = 1, speed = 40 }) {
  const doubled = [...items, ...items]
  const totalWidth = items.length * 180 // approximate px per chip

  return (
    <div className="overflow-hidden relative">
      {/* Left/right fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10
                      bg-gradient-to-r from-surface to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10
                      bg-gradient-to-l from-surface to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: direction > 0 ? [-totalWidth, 0] : [0, -totalWidth] }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {doubled.map((item, i) => <Chip key={i} item={item} />)}
      </motion.div>
    </div>
  )
}

export default function TechStack() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="tech" className="py-24 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-mono text-brand-400 tracking-widest
                           uppercase mb-4 border border-brand-500/20 px-4 py-1 rounded-full glass">
            Technology Stack
          </span>
          <h2 className="font-display text-4xl font-700 tracking-tight text-white">
            Production-Grade <span className="text-gradient">Toolchain</span>
          </h2>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col gap-4"
      >
        <MarqueeRow items={TECH}                direction={1}  speed={45} />
        <MarqueeRow items={[...TECH].reverse()} direction={-1} speed={38} />
      </motion.div>
    </section>
  )
}
