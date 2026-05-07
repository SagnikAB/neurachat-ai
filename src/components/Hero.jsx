// src/components/Hero.jsx
// Full-screen hero with animated chat preview and headline

import { motion } from 'framer-motion'
import { ArrowRight, Github, Star } from 'lucide-react'
import { fadeUp, staggerContainer } from '../utils/animations.js'
import ChatPreview from './ChatPreview.jsx'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 hero-glow overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Copy ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full
                               text-xs font-mono text-brand-300 border border-brand-500/20">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                Claude API · Web Search · Multi-turn Memory · v3.0
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={0.1}
              className="font-display text-5xl lg:text-7xl font-800 leading-[1.05] tracking-tight text-balance"
            >
              AI That Actually{' '}
              <span className="text-gradient block">Understands</span>
              You.
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-zinc-400 text-lg leading-relaxed max-w-md"
            >
              NeuraChat uses Claude — Anthropic's frontier AI — with real-time web
              search to deliver instant, accurate, context-aware responses.
              No hallucinations. No stale data.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={0.3} className="flex flex-wrap items-center gap-4 mt-2">
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400
                           text-white font-medium px-6 py-3 rounded-xl
                           transition-all duration-200 shadow-glow-sm hover:shadow-glow-md"
              >
                Try Live Demo
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://github.com/SagnikAB/neurachat-ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 glass hover:bg-white/10
                           text-zinc-200 font-medium px-6 py-3 rounded-xl
                           transition-all duration-200 border border-white/10"
              >
                <Github size={16} />
                View on GitHub
              </a>
            </motion.div>

            {/* Social proof mini */}
            <motion.div variants={fadeUp} custom={0.4} className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['#22a666','#45c182','#7cd9a9','#178651'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-surface"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="font-medium text-zinc-200">4.9</span>
                · Loved by 2,400+ developers
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: Chat Preview ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatPreview />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="hidden lg:flex flex-col items-center gap-2 absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <span className="text-xs text-zinc-600 font-mono">scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-500/60 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </section>
  )
}
