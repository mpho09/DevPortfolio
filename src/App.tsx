import { MotionConfig } from 'framer-motion'
import { Backdrop } from '@/components/layout/Backdrop'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SmoothScrollProvider } from '@/lib/smoothScroll'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Hero } from '@/sections/Hero'
import { Journey } from '@/sections/Journey'
import { Projects } from '@/sections/Projects'
import { Services } from '@/sections/Services'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <div className="relative isolate">
          <Backdrop />
          <a
            href="#main"
            className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-medium text-void transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="overflow-x-clip">
            <Hero />
            <About />
            <Services />
            <Projects />
            <Journey />
            <Contact />
          </main>
          <Footer />
        </div>
      </SmoothScrollProvider>
    </MotionConfig>
  )
}
