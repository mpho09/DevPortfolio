import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { navLinks, profile } from '@/data/profile'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useSmoothScroll } from '@/lib/smoothScroll'

const ids = navLinks.map((l) => l.id)

export function Navbar() {
  const active = useActiveSection(ids)
  const { scrollTo, lock } = useSmoothScroll()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  const menuButton = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  // Hide on scroll down, reveal on scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 500 && y > prev && !open)
  })

  useEffect(() => {
    lock(open)
    if (open) firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lock])

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setOpen(false)
    // Wait a tick so the scroll lock releases before scrolling
    requestAnimationFrame(() => scrollTo(id === 'top' ? 0 : `#${id}`))
  }

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-[linear-gradient(90deg,#3d7bff,#8b5cf6,#22d3ee)]"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-[1320px] items-center justify-between gap-4 rounded-full py-2 pr-2 pl-5 transition-[background-color,border-color,box-shadow] duration-500 ${
            scrolled || open
              ? 'glass bg-[rgba(9,10,16,0.78)] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]'
              : 'border border-transparent'
          }`}
        >
          <a href="#top" onClick={(e) => go(e, 'top')} className="group flex items-center gap-3" aria-label="Mpho Mangena, back to top">
            <span className="relative grid size-8 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <svg viewBox="0 0 64 64" className="size-5" aria-hidden>
                <defs>
                  <linearGradient id="nav-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#3d7bff" />
                    <stop offset=".55" stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <path d="M12 48V16l20 20 20-20v32" fill="none" stroke="url(#nav-g)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Mpho<span className="text-mist">.dev</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => go(e, link.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative isolate block rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-mist hover:text-ink'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-white/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-void transition-colors hover:bg-cyan sm:inline-flex"
            >
              Let's talk <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid size-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-void/90 px-6 pt-28 pb-10 backdrop-blur-2xl md:hidden"
          >
            <ul className="space-y-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${link.id}`}
                    onClick={(e) => go(e, link.id)}
                    className="flex items-baseline gap-4 py-2 font-display text-5xl font-bold tracking-tight"
                  >
                    <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist">
              <a href={`mailto:${profile.email}`} className="hover:text-ink">Email</a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">LinkedIn</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
