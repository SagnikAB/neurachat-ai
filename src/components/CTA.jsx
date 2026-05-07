// src/components/CTA.jsx
// Final call-to-action with gradient highlight

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Github } from 'lucide-react'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-28 px-6 lg:px-10" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative glass-strong rounded-3xl border border-white/10
                     overflow-hidden text-center px-8 py-20 shadow-glass"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/15 via-transparent to-brand-900/10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40
                          bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block text-xs font-mono text-brand-400 tracking-widest
                             uppercase mb-6 border border-brand-500/20 px-4 py-1 rounded-full glass">
              Open Source · MIT Licensed
            </span>

            <h2 className="font-display text-4xl lg:text-6xl font-800 tracking-tight
                           text-white mb-6 leading-tight">
              Build Your AI Agent
              <br />
              <span className="text-gradient">Starting Today.</span>
            </h2>

            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Clone the repo, drop in your intent JSON, run one training command,
              and deploy to Vercel. Your custom chatbot lives in under 30 minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400
                           text-white font-display font-600 px-8 py-4 rounded-xl text-base
                           transition-all duration-200 shadow-glow-md hover:shadow-glow-lg"
              >
                Try Live Demo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 glass hover:bg-white/10
                           border border-white/12 hover:border-brand-500/40
                           text-zinc-200 font-display font-600 px-8 py-4 rounded-xl text-base
                           transition-all duration-200"
              >
                <Github size={18} />
                Star on GitHub
              </a>
            </div>

            {/* Mini social proof */}
            <p className="text-xs text-zinc-600 mt-8 font-mono">
              MIT License · Python + React · Deployable in &lt;30 min · Zero vendor lock-in
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
