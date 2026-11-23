import { ArrowUp } from 'lucide-react'
import { profile } from '@/data/profile'
import { useSmoothScroll } from '@/lib/smoothScroll'

export function Footer() {
  const { scrollTo } = useSmoothScroll()
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none overflow-hidden">
        <p className="container-x -mb-[0.18em] pt-10 text-center font-display text-[clamp(3rem,15vw,15rem)] leading-none font-extrabold tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)]">
          MANGENA
        </p>
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-4 py-8 text-[13px] text-dim sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. Designed &amp; built in {profile.location}.
        </p>
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="group inline-flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:text-ink"
        >
          Back to top
          <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden />
        </button>
      </div>
    </footer>
  )
}
