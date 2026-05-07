// src/App.jsx
import { useEffect } from 'react'
import Navbar     from './components/Navbar.jsx'
import Hero       from './components/Hero.jsx'
import Features   from './components/Features.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import LiveDemo   from './components/LiveDemo.jsx'
import TechStack  from './components/TechStack.jsx'
import CTA        from './components/CTA.jsx'
import Footer     from './components/Footer.jsx'

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="min-h-screen bg-surface relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]
                        bg-brand-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[400px]
                        bg-brand-700/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[300px]
                        bg-brand-500/6 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <LiveDemo />
          <TechStack />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  )
}