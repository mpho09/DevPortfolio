import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/ui/Reveal'
import { useParticleShape } from '@/lib/particleShape'
import { timeline, timelineKinds, type TimelineKind } from '@/data/timeline'

const kindColor: Record<TimelineKind, string> = {
  work: '#38bdf8',
  certification: '#06b6d4',
  hackathon: '#f6c445',
  collaboration: '#8b5cf6',
}

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null)
  useParticleShape(sectionRef, 'ring')
  return (
    <section ref={sectionRef} id="journey" aria-labelledby="journey-title" className="relative py-28 sm:py-40">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="min-w-0 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <p className="section-badge mb-6">Journey</p>
            <h2 id="journey-title" className="display-heading text-[clamp(1.9rem,6vw,3rem)] lg:text-[clamp(2rem,3.1vw,3.25rem)]">
              Experience
              <span>&amp; milestones</span>
            </h2>
            <p className="mt-6 max-w-sm text-[16.5px] leading-[1.8] text-mist">
              From the server room to leading product teams: client support, systems work, certifications, hackathon finals and
              collaborative builds.
            </p>
            <div className="decorative-line mt-8" />
            <ul aria-label="Legend" className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
              {(Object.keys(kindColor) as TimelineKind[]).map((k) => (
                <li key={k} className="flex items-center gap-2 text-[12.5px] text-mist">
                  <span className="size-2 rounded-full" style={{ background: kindColor[k] }} aria-hidden />
                  {timelineKinds[k]}
                </li>
              ))}
            </ul>
          </Reveal>

          <ol className="min-w-0 border-t border-white/[0.08] lg:col-span-7">
            {timeline.map((item) => {
              const color = kindColor[item.kind]
              return (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative grid gap-3 border-b border-white/[0.08] py-8 sm:grid-cols-[10rem_1fr] sm:gap-8 sm:py-10"
                >
                  <span
                    aria-hidden
                    className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                    style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                  />
                  <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                    <span className="font-mono text-[13px] text-mist">{item.period}</span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.16em] uppercase"
                      style={{ color, background: `${color}14`, boxShadow: `inset 0 0 0 1px ${color}40` }}
                    >
                      {timelineKinds[item.kind]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink/60">{item.org}</p>
                    <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-mist text-pretty">{item.description}</p>
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
