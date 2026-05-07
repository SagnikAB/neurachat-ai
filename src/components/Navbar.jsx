// src/components/Navbar.jsx
// Sticky glassmorphism navigation bar

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features',   href: '#features'    },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Live Demo',  href: '#demo'         },
  { label: 'Tech Stack', href: '#tech'         },
  { label: 'Reviews',    href: '#testimonials' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
        ${scrolled
          ? 'glass border-b border-white/5 shadow-glass'
          : 'bg-transparent border-b border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center
                           shadow-glow-sm group-hover:shadow-glow-md transition-shadow duration-300">
            <Zap size={16} className="text-white fill-white" />
          </span>
          <span className="font-display font-700 text-lg tracking-tight text-white">
            Neura<span className="text-gradient">Chat</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-400 hover:text-brand-300
                         transition-colors duration-200 font-body"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2"
          >
            GitHub
          </a>
          <a
            href="#demo"
            className="text-sm font-medium bg-brand-500 hover:bg-brand-400
                       text-white px-5 py-2 rounded-lg transition-all duration-200
                       shadow-glow-sm hover:shadow-glow-md"
          >
            Try Demo
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-zinc-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass border-t border-white/5 px-6 pb-6 pt-4 flex flex-col gap-4"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-zinc-300 hover:text-brand-300 transition-colors text-sm py-1"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#demo"
              onClick={() => setMenuOpen(false)}
              className="mt-2 bg-brand-500 text-white text-sm font-medium
                         text-center py-2.5 rounded-lg shadow-glow-sm"
            >
              Try Live Demo
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
