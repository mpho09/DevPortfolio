import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'

interface SmoothScrollApi {
  scrollTo: (target: string | number, opts?: { immediate?: boolean }) => void
  lock: (locked: boolean) => void
}

const SmoothScrollContext = createContext<SmoothScrollApi>({
  scrollTo: () => {},
  lock: () => {},
})

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Lenis-powered smooth scrolling. Falls back to native scrolling when the user
 * prefers reduced motion. Also exposes a scrollTo that respects the fixed nav.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  // Honour deep links like /#work once the SPA has rendered its sections
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash === '#top') return
    const t = window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>(hash)
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80 })
    }, 60)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenisRef.current = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback<SmoothScrollApi['scrollTo']>((target, opts) => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : null
    const offset = -80
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el ?? (target as number), { offset: el ? offset : 0, immediate: opts?.immediate })
    } else if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target })
    }
    // Move keyboard focus to the target section for screen-reader and keyboard users
    if (el) {
      el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
  }, [])

  const lock = useCallback((locked: boolean) => {
    if (lenisRef.current) {
      if (locked) lenisRef.current.stop()
      else lenisRef.current.start()
    }
    document.documentElement.style.overflow = locked ? 'hidden' : ''
  }, [])

  return <SmoothScrollContext.Provider value={{ scrollTo, lock }}>{children}</SmoothScrollContext.Provider>
}

export const useSmoothScroll = () => useContext(SmoothScrollContext)
