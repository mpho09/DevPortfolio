import { ArrowUp } from 'lucide-react'
import { Logo } from '@/components/layout/Navbar'
import { navLinks, profile } from '@/data/profile'
import { useSmoothScroll } from '@/lib/smoothScroll'

export function Footer() {
  const { scrollTo } = useSmoothScroll()
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(6,182,212,0.5),transparent)]" />
      <div className="container-x flex flex-col gap-10 py-14 lg:flex-row lg:items-center lg:justify-between">
        <Logo />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
            {[...navLinks, { id: 'contact', label: 'Contact' } as const].map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(`#${l.id}`)
                  }}
                  className="transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-7 text-[13px] text-dim sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <div className="flex items-center gap-6">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            LinkedIn
          </a>
          <button type="button" onClick={() => scrollTo(0)} className="group inline-flex items-center gap-2 transition-colors hover:text-white">
            Back to top
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  )
}
