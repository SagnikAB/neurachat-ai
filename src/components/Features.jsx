// src/components/Features.jsx
// Six-card feature grid with hover effects and icons

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Brain, MessageSquare, Zap, Database,
  Shield, RefreshCw,
} from 'lucide-react'
import { staggerContainer, fadeUp } from '../utils/animations.js'

const FEATURES = [
  {
    icon: Brain,
    color: 'from-brand-500/20 to-brand-700/10',
    border: 'border-brand-500/20',
    iconColor: 'text-brand-300',
    title: 'LSTM Neural Network',
    desc: 'Bidirectional LSTM layers capture long-range sequential dependencies, enabling nuanced understanding of user intent across multi-turn conversations.',
  },
  {
    icon: MessageSquare,
    color: 'from-violet-500/20 to-violet-700/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-300',
    title: 'NLTK Preprocessing',
    desc: 'Tokenization, lemmatization, stopword removal, and POS tagging via NLTK pipelines ensure clean, structured input before inference.',
  },
  {
    icon: Zap,
    color: 'from-amber-500/20 to-amber-700/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-300',
    title: 'Sub-120ms Inference',
    desc: 'Optimized TensorFlow Lite model export and caching layer delivers near-instant responses even on constrained hardware.',
  },
  {
    icon: Database,
    color: 'from-cyan-500/20 to-cyan-700/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-300',
    title: 'Custom Intent Datasets',
    desc: 'Train on your own JSON intent files. Supports multi-label classification, fallback intents, and confidence thresholding out of the box.',
  },
  {
    icon: Shield,
    color: 'from-rose-500/20 to-rose-700/10',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-300',
    title: 'Retrieval-Based Safety',
    desc: 'Purely retrieval-based responses mean no hallucination — the model only returns answers anchored in your training corpus.',
  },
  {
    icon: RefreshCw,
    color: 'from-emerald-500/20 to-emerald-700/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-300',
    title: 'Continuous Re-training',
    desc: 'One-command fine-tuning pipeline with automatic data augmentation, stratified splits, and validation metrics dashboard.',
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
            <span className="text-gradient">Powered by Science</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Every component is engineered for production: from training pipelines to
            deployment, NeuraChat handles the complexity so you can focus on your product.
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
