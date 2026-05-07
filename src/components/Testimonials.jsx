// src/components/Testimonials.jsx
// Review cards with star ratings and avatars

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { staggerContainer, fadeUp } from '../utils/animations.js'

const REVIEWS = [
  {
    name: 'Priya Mehta',
    role: 'ML Engineer · Bangalore',
    stars: 5,
    avatar: 'PM',
    color: 'from-violet-500 to-purple-600',
    text: 'NeuraChat\'s LSTM pipeline is genuinely impressive. I integrated it into our customer support system in a weekend — training pipeline, model export, and REST API all worked first try.',
  },
  {
    name: 'Rohan Sharma',
    role: 'Backend Dev · Mumbai',
    stars: 5,
    avatar: 'RS',
    color: 'from-brand-500 to-emerald-600',
    text: 'The intent accuracy blew me away. We\'re running it in production with 3,000 daily queries and have seen zero hallucinations since it\'s retrieval-based. 10/10 architecture.',
  },
  {
    name: 'Ayesha Khan',
    role: 'NLP Researcher · Delhi',
    stars: 5,
    avatar: 'AK',
    color: 'from-amber-500 to-orange-600',
    text: 'Finally a chatbot framework that takes NLP seriously. NLTK preprocessing + LSTM training + confidence thresholding — it\'s everything I\'d build from scratch, already done.',
  },
  {
    name: 'Dev Patel',
    role: 'Full-Stack · Pune',
    stars: 5,
    avatar: 'DP',
    color: 'from-cyan-500 to-blue-600',
    text: 'I used this for my capstone project. The docs are clear, the code is clean, and the live demo convinced my entire team before we even read the README.',
  },
  {
    name: 'Sneha Joshi',
    role: 'Data Scientist · Hyderabad',
    stars: 5,
    avatar: 'SJ',
    color: 'from-rose-500 to-pink-600',
    text: 'Switching from rule-based to LSTM-based intent classification doubled our accuracy. The custom dataset training pipeline is just a JSON file away.',
  },
  {
    name: 'Arjun Nair',
    role: 'AI Intern · Chennai',
    stars: 5,
    avatar: 'AN',
    color: 'from-teal-500 to-green-600',
    text: 'As a student getting into NLP, this was the perfect project to learn from. Real architecture, real code, real results. Way better than toy tutorials.',
  },
]

function ReviewCard({ review, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.07}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15
                 transition-all duration-300 hover:shadow-glass flex flex-col gap-4"
    >
      {/* Quote icon */}
      <Quote size={18} className="text-brand-500/50 flex-shrink-0" />

      {/* Text */}
      <p className="text-sm text-zinc-300 leading-relaxed flex-1">
        "{review.text}"
      </p>

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: review.stars }).map((_, i) => (
          <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/6">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${review.color}
                         flex items-center justify-center text-xs font-display font-700
                         text-white flex-shrink-0`}>
          {review.avatar}
        </div>
        <div>
          <div className="text-sm font-display font-600 text-white">{review.name}</div>
          <div className="text-xs text-zinc-500">{review.role}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="testimonials" className="py-28 px-6 lg:px-10" ref={ref}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-mono text-brand-400 tracking-widest
                           uppercase mb-4 border border-brand-500/20 px-4 py-1 rounded-full glass">
            Testimonials
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-700 tracking-tight text-white mb-4">
            Loved by <span className="text-gradient">Engineers</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Real feedback from developers who've shipped NeuraChat in production.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {REVIEWS.map((r, i) => (
            <ReviewCard key={r.name} review={r} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
