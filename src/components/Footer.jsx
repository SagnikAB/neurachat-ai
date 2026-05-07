// src/components/Footer.jsx
// Site footer with links, social icons, and copyright

import { Github, Twitter, Linkedin, Zap } from 'lucide-react'

const LINKS = {
  Product:   ['Features', 'Live Demo', 'Tech Stack', 'Changelog'],
  Resources: ['Documentation', 'GitHub Repo', 'Training Guide', 'API Reference'],
  Community: ['Discussions', 'Discord Server', 'Contributing', 'Code of Conduct'],
}

const SOCIAL = [
  { icon: Github,   href: 'https://github.com',   label: 'GitHub'   },
  { icon: Twitter,  href: 'https://twitter.com',  label: 'Twitter'  },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/6 py-16 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-sm">
                <Zap size={16} className="text-white fill-white" />
              </span>
              <span className="font-display font-700 text-lg text-white">
                Neura<span className="text-gradient">Chat</span>
              </span>
            </a>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mb-6">
              An open-source AI conversational agent powered by Claude and
              real-time web search — accurate, context-aware, and production-ready.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 glass rounded-lg flex items-center justify-center
                               text-zinc-500 hover:text-brand-300 hover:border-brand-500/30
                               border border-white/8 transition-all duration-200"
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Nav groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-4">
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#"
                       className="text-sm text-zinc-400 hover:text-brand-300 transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 font-mono">
            © {new Date().getFullYear()} NeuraChat. MIT License.
          </p>
          <p className="text-xs text-zinc-600">
            Built with Claude API · Web Search · React · Tailwind CSS · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
