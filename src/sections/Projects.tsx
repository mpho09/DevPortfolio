import { ArrowLeft, ArrowRight, ArrowUpRight, Lock, UserRound } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { siGithub } from 'simple-icons'
import { ProjectPreview } from '@/components/ProjectPreview'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { Reveal } from '@/components/ui/Reveal'
import { useParticleShape } from '@/lib/particleShape'
import { projects, type Project } from '@/data/projects'

function ProjectLinks({ project }: { project: Project }) {
  const base = 'inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-[background-position,border-color,color,box-shadow] duration-500'
  return (
    <div className="flex flex-wrap gap-3">
      {project.live ? (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} bg-[linear-gradient(90deg,#2563eb,#06b6d4,#2563eb)] bg-[length:200%_100%] text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)] hover:bg-right`}
        >
          Live demo <ArrowUpRight className="size-4" aria-hidden />
          <span className="sr-only">for {project.name} (opens in a new tab)</span>
        </a>
      ) : (
        <span className={`${base} cursor-default border border-dashed border-white/15 text-dim`}>Demo on request</span>
      )}
      {project.githubPrivate ? (
        <span
          className={`${base} cursor-default border border-white/10 text-mist`}
          title="This team repository is private. Code walkthroughs are available on request."
        >
          <Lock className="size-4" aria-hidden /> Private repo
        </span>
      ) : (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className={`${base} border border-white/15 text-ink hover:border-cyan/50`}>
          <BrandIcon icon={siGithub} className="size-4" /> GitHub
          <span className="sr-only">repository for {project.name} (opens in a new tab)</span>
        </a>
      )}
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      aria-roledescription="slide"
      className="glass group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-5 sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 -left-1/4 size-[70%] rounded-full opacity-30 blur-[110px]"
        style={{ background: project.accent }}
      />
      <div className="relative">
        <ProjectPreview project={project} />
      </div>

      <div className="relative mt-8 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: project.accent }}>
            {project.kicker}
          </p>
          <span aria-hidden className="font-mono text-xs text-dim">
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
        <h3 id={`project-${project.slug}`} className="mt-3 text-[clamp(1.9rem,3vw,2.75rem)] leading-none font-extrabold tracking-[0.03em] uppercase">
          {project.name}
        </h3>
        <p className="mt-4 text-[17px] font-medium text-ink/90 text-balance">{project.tagline}</p>
        <p className="mt-3 text-[15px] leading-[1.75] text-mist text-pretty">{project.description}</p>
        <p className="mt-5 flex items-start gap-2 text-sm text-ink/80">
          <UserRound className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
          {project.role}
        </p>
        <ul aria-label="Technologies used" className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11.5px] text-mist">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-8">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  useParticleShape(sectionRef, 'sphere')
  const track = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setAtStart(el.scrollLeft < 8)
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const step = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * ((card?.clientWidth ?? el.clientWidth) + gap), behavior: 'smooth' })
  }

  const arrow =
    'grid size-14 place-items-center rounded-full border border-white/15 text-white transition-[background-color,border-color,opacity] duration-300 hover:border-cyan/60 hover:bg-cyan/10 disabled:pointer-events-none disabled:opacity-30'

  return (
    <section ref={sectionRef} id="projects" aria-labelledby="projects-title" className="relative py-28 sm:py-40">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <p className="section-badge mb-6">Projects</p>
            <h2 id="projects-title" className="display-heading">
              Selected
              <span>work</span>
            </h2>
            <p className="mt-5 max-w-md text-[16.5px] leading-[1.8] text-mist">
              Four products spanning marketplaces, personal security, economic empowerment and smarter shopping.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex gap-3">
            <button type="button" onClick={() => step(-1)} disabled={atStart} aria-label="Previous project" aria-controls="project-track" className={arrow}>
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => step(1)} disabled={atEnd} aria-label="Next project" aria-controls="project-track" className={arrow}>
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </Reveal>
        </div>
      </div>

      <Reveal y={60} className="mt-14 lg:mt-20">
        <ul
          id="project-track"
          ref={track}
          onScroll={update}
          aria-label="Projects"
          className="flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(6rem,calc((100vw-1440px)/2+6rem))] lg:gap-6 lg:px-[max(6rem,calc((100vw-1440px)/2+6rem))] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => (
            <li key={p.slug} className="w-[min(88vw,620px)] shrink-0 snap-start">
              <ProjectCard project={p} index={i} />
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="container-x mt-8 flex justify-center">
        <a
          href="https://github.com/mpho09?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-mist transition-colors hover:text-ink"
        >
          <BrandIcon icon={siGithub} className="size-4" />
          More experiments on GitHub
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </a>
      </div>
    </section>
  )
}
