import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { profile } from '@/data/profile'
import { useParticleShape } from '@/lib/particleShape'
import { useSmoothScroll } from '@/lib/smoothScroll'

const ease = [0.16, 1, 0.3, 1] as const

function Rise({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
      <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay, ease }}>
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  useParticleShape(ref, 'ring')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative flex min-h-svh items-end overflow-hidden">
      <motion.div style={{ y, opacity }} className="container-x relative w-full pt-32 pb-[clamp(5rem,12vh,9rem)]">
        <div className="flex items-end justify-between gap-16">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="section-badge mb-8"
            >
              {profile.availability} · {profile.location}
            </motion.p>

            <h1 id="hero-title" className="text-[clamp(2.75rem,4vw+1.5rem,5.4rem)] leading-[1.05] font-medium tracking-[-0.03em]">
              <span className="sr-only">
                {profile.name}, {profile.role}.{' '}
              </span>
              <span aria-hidden>
                <Rise delay={0.35}>
                  <span className="text-gradient">{profile.firstName}</span> {profile.lastName}
                </Rise>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease }}
              className="mt-6 max-w-[520px] text-[clamp(0.95rem,0.7vw+0.5rem,1.15rem)] leading-[1.8] text-mist"
            >
              I build fast, accessible web products with React, TypeScript and Node.js, from a clear spec and a secure database
              through to an interface people enjoy using.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease }}
              className="mt-10"
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo('#contact')
                }}
                className="flow-btn"
              >
                Let's begin!
                <ArrowUpRight className="size-5" aria-hidden />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.6, duration: 1 }}
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="text-[10px] tracking-[0.3em] text-white uppercase">Scroll</span>
        <span className="h-12 w-px overflow-hidden bg-white/10">
          <span className="block h-full w-full animate-[scroll-line_2.2s_ease-in-out_infinite] bg-cyan" />
        </span>
      </motion.div>
    </section>
  )
}
