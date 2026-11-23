import { ArrowUpRight, Lock, UserRound } from 'lucide-react'
import { siGithub } from 'simple-icons'
import { ProjectPreview } from '@/components/ProjectPreview'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TiltCard } from '@/components/ui/TiltCard'
import { projects, type Project } from '@/data/projects'

function ProjectLinks({ project }: { project: Project }) {
  const base =
    'inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-300'
  return (
    <div className="flex flex-wrap gap-3">
      {project.live ? (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} bg-white text-void hover:bg-cyan hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.8)]`}
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
        <a href={project.github} target="_blank" rel="noopener noreferrer" className={`${base} glass text-ink hover:border-white/25`}>
          <BrandIcon icon={siGithub} className="size-4" /> GitHub
          <span className="sr-only">repository for {project.name} (opens in a new tab)</span>
        </a>
      )}
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1
  return (
    <Reveal y={60}>
      <TiltCard max={3.5} glow={`${project.accent}24`} className="rounded-[2rem]">
        <article
          aria-labelledby={`project-${project.slug}`}
          className="glass relative grid gap-10 overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-12 [transform-style:preserve-3d]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-1/3 size-[70%] rounded-full opacity-40 blur-[120px]"
            style={{ background: project.accent, [flip ? 'right' : 'left']: '-10%' }}
          />

          <div className={`relative min-w-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''} [transform:translateZ(40px)]`}>
            <ProjectPreview project={project} />
          </div>

          <div className={`relative flex min-w-0 flex-col lg:col-span-5 ${flip ? 'lg:order-1' : ''} [transform:translateZ(25px)]`}>
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: project.accent }}>
                {project.kicker}
              </p>
              <span aria-hidden className="font-display text-5xl font-extrabold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3 id={`project-${project.slug}`} className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none font-bold tracking-[-0.035em]">
              {project.name}
            </h3>
            <p className="mt-4 text-lg font-medium text-ink/90 text-balance">{project.tagline}</p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-mist text-pretty">{project.description}</p>

            <p className="mt-5 flex items-start gap-2 text-sm text-ink/80">
              <UserRound className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
              {project.role}
            </p>

            <ul aria-label="Technologies used" className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11.5px] text-mist">
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 lg:mt-auto lg:pt-8">
              <ProjectLinks project={project} />
            </div>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  )
}

export function Projects() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Featured projects"
          id="work-title"
          title={
            <>
              Products built to <span className="text-gradient">matter.</span>
            </>
          }
          intro="Four products spanning marketplaces, personal security, economic empowerment and smarter shopping. Each started with a real problem and a clear spec."
        />
        <div className="mt-16 space-y-8 lg:mt-24 lg:space-y-12">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
        <Reveal className="mt-14 flex justify-center">
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
        </Reveal>
      </div>
    </section>
  )
}
