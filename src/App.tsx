import { MotionConfig } from 'framer-motion'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SmoothScrollProvider } from '@/lib/smoothScroll'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Experience } from '@/sections/Experience'
import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { Skills } from '@/sections/Skills'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <div className="grain">
          <a
            href="#main"
            className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-medium text-void transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <Footer />
        </div>
      </SmoothScrollProvider>
    </MotionConfig>
  )
}
