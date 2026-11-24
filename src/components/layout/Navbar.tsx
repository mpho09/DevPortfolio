import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { navLinks, profile } from '@/data/profile'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useSmoothScroll } from '@/lib/smoothScroll'

const ids = [...navLinks.map((l) => l.id), 'contact']
const ease = [0.16, 1, 0.3, 1] as const

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <svg viewBox="0 0 64 64" className="size-8" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2563eb" />
            <stop offset=".55" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M10 50V14l22 22 22-22v36" fill="none" stroke="url(#logo-g)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[15px] leading-none font-semibold tracking-tight">
        Mpho <span className="text-mist">Mangena</span>
      </span>
    </span>
  )
}

export function Navbar() {
  const active = useActiveSection(ids)
  const { scrollTo, lock } = useSmoothScroll()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const menuButton = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

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
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav aria-label="Primary" className="relative mx-auto flex h-20 max-w-[1800px] items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-12">
          <a href="#top" onClick={(e) => go(e, 'top')} aria-label="Mpho Mangena, back to top" className="relative z-10">
            <Logo />
          </a>

          {/* Centred menu that turns into a glass pill once you scroll */}
          <div
            className={`absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full px-8 py-1 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 md:block ${
              scrolled
                ? 'border border-white/[0.08] bg-[rgba(10,16,35,0.65)] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl'
                : 'border border-transparent'
            }`}
          >
            <ul className="flex items-center gap-8 lg:gap-12">
              {navLinks.map((link) => {
                const isActive = active === link.id
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => go(e, link.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative block py-3 text-[15px] transition-colors duration-300 lg:text-base ${
                        isActive ? 'text-white' : 'text-white/45 hover:text-white'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute bottom-1.5 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-sm bg-[linear-gradient(90deg,#2563eb,#06b6d4)] shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => go(e, 'contact')}
              className="group hidden items-center gap-2 text-[15px] text-white md:inline-flex lg:text-base"
            >
              <span className="relative">
                Contact
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-white transition-transform duration-500 group-hover:scale-x-0" />
              </span>
              <ArrowUpRight className="size-6 stroke-[1.5] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </a>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative grid size-11 place-items-center md:hidden"
            >
              <span className={`absolute h-[2px] w-7 rounded bg-white transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
              <span className={`absolute h-[2px] w-7 rounded bg-white transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
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
            className="fixed inset-0 z-40 flex flex-col justify-between bg-void/95 px-6 pt-28 pb-10 backdrop-blur-2xl md:hidden"
          >
            <ul className="space-y-2">
              {[...navLinks, { id: 'contact', label: 'Contact' } as const].map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.5, ease }}
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${link.id}`}
                    onClick={(e) => go(e, link.id)}
                    className="block py-2 text-4xl font-extrabold tracking-[0.04em] uppercase"
                  >
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
