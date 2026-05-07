// src/components/TechStack.jsx
// Scrolling marquee of technologies used

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const TECH = [
  { name: 'Python 3.11',    color: '#3776AB' },
  { name: 'TensorFlow',     color: '#FF6F00' },
  { name: 'Keras',          color: '#D00000' },
  { name: 'NLTK',           color: '#22a666' },
  { name: 'NumPy',          color: '#013243' },
  { name: 'scikit-learn',   color: '#F7931E' },
  { name: 'FastAPI',        color: '#009688' },
  { name: 'Uvicorn',        color: '#2C3E50' },
  { name: 'React 18',       color: '#61DAFB' },
  { name: 'Tailwind CSS',   color: '#06B6D4' },
  { name: 'Framer Motion',  color: '#BB4FFF' },
  { name: 'Docker',         color: '#2496ED' },
  { name: 'Vercel',         color: '#ffffff' },
  { name: 'GitHub Actions', color: '#2088FF' },
]

function Marquee({ items, reverse = false }) {
  return (
    <div className="overflow-hidden relative">
      <div className={`flex gap-4 ${reverse ? 'animate-[marqueeR_30s_linear_infinite]' : 'animate-[marquee_30s_linear_infinite]'} w-max`}>
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 glass border border-white/8 rounded-xl
                       px-5 py-3 whitespace-nowrap flex-shrink-0"
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-mono text-zinc-300">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TechStack() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="tech" className="py-24 overflow-hidden" ref={ref}>
      {/* Custom keyframes via style tag */}
      <style>{`
        @keyframes marquee  { 0% { transform: translateX(0) }  100% { transform: translateX(-50%) } }
        @keyframes marqueeR { 0% { transform: translateX(-50%) } 100% { transform: translateX(0) } }
      `}</style>

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
        <Marquee items={TECH.slice(0, 9)} />
        <Marquee items={TECH.slice(5)}   reverse />
      </motion.div>
    </section>
  )
}
