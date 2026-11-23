import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, Sparkles } from 'lucide-react'
import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { profile } from '@/data/profile'
import { useSmoothScroll } from '@/lib/smoothScroll'

// The WebGL scene is code-split so text paints immediately and three.js loads in parallel
const HeroScene = lazy(() => import('@/components/three/HeroScene'))

const ease = [0.16, 1, 0.3, 1] as const

function SplitWord({ word, delay, className = '' }: { word: string; delay: number; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {word}
      </motion.span>
    </span>
  )
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  const [sceneReady, setSceneReady] = useState(false)
  const [canRender3D, setCanRender3D] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => setCanRender3D(webglAvailable()), [])

  const heading = 'Building Digital Experiences That Matter.'.split(' ')

  return (
    <section ref={ref} id="top" aria-labelledby="hero-name" className="relative isolate flex min-h-svh items-end overflow-hidden lg:items-center">
      {/* Ambient gradients, visible while/if the 3D scene loads */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute top-[-10%] right-[-10%] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(61,123,255,0.18),transparent_60%)]" />
        <div className="absolute bottom-[-20%] left-[-15%] size-[55vmax] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] bg-[size:72px_72px]" />
      </div>

      <motion.div
        className="absolute inset-0 -z-10"
        style={{ opacity: sceneOpacity, scale: sceneScale }}
        initial={false}
        animate={{ filter: sceneReady ? 'blur(0px)' : 'blur(12px)' }}
        transition={{ duration: 1.6, ease }}
      >
        {canRender3D && (
          <Suspense fallback={null}>
            <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: sceneReady ? 1 : 0 }} transition={{ duration: 1.6 }}>
              <HeroScene onReady={() => setSceneReady(true)} />
            </motion.div>
          </Suspense>
        )}
      </motion.div>

      {/* Readability scrim for small screens where text overlaps the object */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[-5] bg-[linear-gradient(180deg,transparent_25%,rgba(5,6,10,0.7)_55%,rgba(5,6,10,0.9)_85%)] lg:bg-[linear-gradient(90deg,rgba(5,6,10,0.75)_0%,transparent_60%)]" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x relative pt-32 pb-28 lg:pt-28 lg:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="glass mb-8 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2 text-[13px] text-mist"
        >
          <span className="relative flex size-2.5 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan" />
          </span>
          {profile.availability} · {profile.location}
        </motion.p>

        <h1 id="hero-name" className="font-display leading-[0.9] font-bold tracking-[-0.05em]">
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden className="block text-[clamp(2.9rem,12.4vw,8.5rem)]">
            <SplitWord word={profile.firstName} delay={0.15} />
          </span>
          <span aria-hidden className="block text-[clamp(2.9rem,12.4vw,8.5rem)]">
            <SplitWord word={profile.lastName} delay={0.25} />
            <motion.span
              aria-hidden
              className="ml-[0.05em] inline-block size-[0.15em] rounded-full bg-[linear-gradient(135deg,#3d7bff,#8b5cf6,#22d3ee)] shadow-[0_0_24px_rgba(34,211,238,0.7)]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6, ease }}
            />
          </span>
        </h1>

        <p className="mt-8 max-w-[18ch] font-display text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[1.05] font-semibold tracking-[-0.025em] text-balance sm:max-w-[22ch]">
          {heading.map((w, i) => (
            <Fragment key={i}>
              <SplitWord word={w} delay={0.45 + i * 0.06} className={i === heading.length - 1 ? 'text-gradient' : ''} />
              {i < heading.length - 1 && ' '}
            </Fragment>
          ))}
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 1 }}
          className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-wide text-mist sm:text-sm"
        >
          <Sparkles className="size-4 text-cyan" aria-hidden />
          Software Developer <span className="text-dim">|</span> Creative Problem Solver
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9, ease }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Button
            href="#work"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#work')
            }}
            icon={<ArrowDownRight className="size-4" aria-hidden />}
          >
            Explore My Work
          </Button>
          <Button
            href="#contact"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#contact')
            }}
          >
            Let's Connect
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        onClick={() => scrollTo('#about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-dim transition-colors hover:text-ink"
        aria-label="Scroll to About section"
      >
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/20 pt-2">
          <motion.span
            className="block h-2 w-1 rounded-full bg-cyan"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
      </motion.button>

      <div aria-hidden className="absolute right-6 bottom-9 hidden font-mono text-[10px] leading-relaxed tracking-[0.2em] text-dim uppercase lg:block lg:right-12">
        25.9992° S · 28.1263° E
        <br />
        <span className="text-mist">Midrand, ZA</span>
      </div>
    </section>
  )
}
