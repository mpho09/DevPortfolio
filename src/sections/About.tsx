import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { useParticleShape } from '@/lib/particleShape'
import { stats } from '@/data/profile'

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return (
    <span ref={ref} className="tabular-nums">
      {value}
      <span className="text-gradient">{suffix}</span>
    </span>
  )
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  useParticleShape(sectionRef, 'helix')
  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-title" className="relative py-28 sm:py-40">
      <div className="container-x">
        {/* Centred intro */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="about-title" className="display-heading">
            Curiosity &amp;
            <span>Craft</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-[clamp(1rem,0.6vw+0.7rem,1.2rem)] leading-[1.8] text-mist text-pretty">
            Every product I build starts with a real problem, a clear spec and a plan for what not to build. By the time I write
            the first component, the hard thinking is done. Then I make it real, one small, tested step at a time.
          </p>
          <div className="decorative-line mx-auto mt-8" />
        </Reveal>

        <div className="mt-24 grid gap-16 lg:mt-36 lg:grid-cols-2 lg:items-center lg:gap-24">
          <Reveal>
            <h3 className="text-[clamp(2.2rem,3vw+0.7rem,3.5rem)] leading-[1.1] font-extrabold tracking-[0.03em] uppercase">
              From the server room
              <span className="text-gradient block">to the codebase</span>
            </h3>
            <div className="mt-8 max-w-xl space-y-5 text-[16.5px] leading-[1.8] text-mist">
              <p>
                I came to code through systems support. Years of installing systems, monitoring networks and helping hosting
                clients taught me how software behaves in the wild, and how it feels when it breaks for a real person.
              </p>
              <p>
                Today I build frontend products in React and TypeScript, backed by Node.js and Supabase. I've led a team as tech
                lead, reached the finals of two hackathons, and taken products from a blank PRD to production. I keep sharpening
                my craft through Melsoft Academy, the FNB App Academy and FMTALI.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <span aria-hidden className="h-px w-12 bg-linear-to-r from-sky to-transparent" />
              <span className="text-[11px] tracking-[0.24em] text-mist uppercase">Meaningful beats flashy</span>
            </div>
          </Reveal>

          <dl className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="glass rounded-3xl p-6 sm:p-8">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-[clamp(2.5rem,4.5vw,4rem)] leading-none font-bold tracking-[-0.04em]">
                    <Counter to={s.value} suffix={s.suffix} />
                  </span>
                  <span aria-hidden className="mt-4 block text-[14.5px] font-medium text-ink">
                    {s.label}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-dim">{s.detail}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
