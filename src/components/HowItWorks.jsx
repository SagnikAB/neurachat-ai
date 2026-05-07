// src/components/HowItWorks.jsx
// Three-step visual pipeline explanation

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileText, Cpu, MessageCircle } from 'lucide-react'
import { fadeUp, staggerContainer } from '../utils/animations.js'

const STEPS = [
  {
    step: '01',
    icon: FileText,
    title: 'Data Preprocessing',
    desc: 'Raw text is tokenized with NLTK, lemmatized, and stripped of noise. Bag-of-words and TF-IDF vectors encode each sentence into model-ready tensors.',
    detail: ['NLTK Tokenizer', 'Lemmatization', 'Stopword Removal', 'Bag-of-Words Encoding'],
  },
  {
    step: '02',
    icon: Cpu,
    title: 'LSTM Training',
    desc: 'A stacked LSTM + Dense network is trained on intent-labeled datasets. Categorical cross-entropy loss drives 98%+ classification accuracy.',
    detail: ['Bidirectional LSTM', 'Dropout Regularization', 'Adam Optimizer', 'Softmax Output'],
  },
  {
    step: '03',
    icon: MessageCircle,
    title: 'Intent Classification & Response',
    desc: 'At inference, user input is vectorized, passed through the trained model, and the highest-confidence intent maps to a curated response pool.',
    detail: ['Real-time Vectorization', 'Intent Matching', 'Confidence Scoring', 'Response Retrieval'],
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="py-28 px-6 lg:px-10" ref={ref}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-mono text-brand-400 tracking-widest
                           uppercase mb-4 border border-brand-500/20 px-4 py-1 rounded-full glass">
            How It Works
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-700 tracking-tight text-white mb-4">
            From Raw Text to{' '}
            <span className="text-gradient">Smart Answers</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Three stages. Milliseconds of latency. Production-grade reliability.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative grid lg:grid-cols-3 gap-8"
        >
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-1/6 right-1/6 h-px
                          bg-gradient-to-r from-transparent via-brand-500/40 to-transparent z-0" />

          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.step}
                variants={fadeUp}
                custom={i * 0.1}
                className="relative z-10"
              >
                {/* Step card */}
                <div className="glass rounded-2xl p-8 border border-white/8 hover:border-brand-500/30
                                transition-all duration-300 hover:shadow-glass group">
                  {/* Step number + icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-brand-500/15 border border-brand-500/25
                                    flex items-center justify-center flex-shrink-0
                                    group-hover:bg-brand-500/25 transition-colors duration-300">
                      <Icon size={24} className="text-brand-300" />
                    </div>
                    <span className="font-mono text-3xl font-700 text-zinc-700">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="font-display font-600 text-xl text-white mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    {s.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {s.detail.map((d) => (
                      <span key={d}
                            className="text-xs font-mono text-brand-300
                                       bg-brand-500/10 border border-brand-500/20
                                       px-2.5 py-1 rounded-lg">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mobile arrow */}
                {i < STEPS.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-px h-8 bg-brand-500/30" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
