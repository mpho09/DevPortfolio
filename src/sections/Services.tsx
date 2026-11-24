import { useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { useParticleShape } from '@/lib/particleShape'
import { services } from '@/data/services'

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  useParticleShape(sectionRef, 'monogram')
  return (
    <section ref={sectionRef} id="services" aria-labelledby="services-title" className="relative py-28 sm:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <Reveal>
            <p className="section-badge mb-6">Services</p>
            <h2 id="services-title" className="display-heading">
              What I
              <span>build</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[16.5px] leading-[1.8] text-mist text-pretty lg:ml-auto">
              A focused stack that takes an idea from wireframe to production, from pixel-perfect interfaces to secure
              databases, delivered with a team-first workflow.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.08} className="h-full">
              <article className="glass group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-cyan/30 sm:p-9">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-cyan/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                />
                <div className="relative flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-electric/30 to-cyan/20 ring-1 ring-white/10">
                    <s.icon className="size-6 text-cyan" aria-hidden />
                  </span>
                  <span aria-hidden className="text-5xl font-extrabold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="relative mt-8 text-xl font-bold tracking-[0.04em] uppercase sm:text-2xl">{s.title}</h3>
                <p className="relative mt-4 text-[15px] leading-[1.8] text-mist">{s.description}</p>
                <ul aria-label={`${s.title} tools`} className="relative mt-auto flex flex-wrap gap-2 pt-8">
                  {s.stack.map((t) => (
                    <li key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11.5px] text-mist">
                      {t}
                    </li>
                  ))}
                </ul>
                <span
                  aria-hidden
                  className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,#06b6d4,transparent)] transition-transform duration-700 group-hover:scale-x-100"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
