import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Compass, Cpu, HeartHandshake } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { stats } from '@/data/profile'

const statement =
  "I'm a developer who came to code through the server room. Years of installing systems, watching networks and supporting real users taught me how software behaves in the wild. Now I build interfaces that are fast, accessible and genuinely useful."

const pillars = [
  {
    icon: Cpu,
    title: 'Technical interests',
    body: 'Frontend engineering with React and TypeScript, real-time 3D on the web, secure backends with Postgres row-level security, and AI-assisted products that feel human.',
  },
  {
    icon: Compass,
    title: 'How I solve problems',
    body: 'Start from the user and a clear PRD, then decide what not to build. I break work into small, tested steps, so each feature ships reliably before the next one starts.',
  },
  {
    icon: HeartHandshake,
    title: 'Why I build',
    body: 'I care about technology that changes something for people, like a vault that protects a family or a tool that helps women grow an income. Meaningful beats flashy.',
  },
]

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

/** Paragraph that lights up word by word as it scrolls through the viewport. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p
      ref={ref}
      className="font-display text-[clamp(1.6rem,3.3vw,2.85rem)] leading-[1.18] font-semibold tracking-[-0.02em] text-ink"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  )
}

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
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow="About me"
          id="about-title"
          title={
            <>
              Curious mind, <span className="text-gradient">careful</span> builder.
            </>
          }
        />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollStatement text={statement} />
            <Reveal className="mt-10 max-w-xl space-y-5 text-[17px] leading-relaxed text-mist">
              <p>
                Today I build frontend products in React and TypeScript, backed by Node.js and Supabase, and I keep
                sharpening my craft through Melsoft Academy, the FNB App Academy and FMTALI. I've led a team as tech lead,
                reached the finals of two hackathons, and shipped products from a blank PRD to production.
              </p>
            </Reveal>
          </div>

          <div className="space-y-4 lg:col-span-5">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article className="glass group relative overflow-hidden rounded-3xl p-6 transition-colors duration-500 hover:border-white/20 sm:p-7">
                  <div
                    aria-hidden
                    className="absolute -top-20 -right-20 size-48 rounded-full bg-violet/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <div className="relative flex gap-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-electric/25 to-violet/25 ring-1 ring-white/10">
                      <p.icon className="size-5 text-cyan" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight">{p.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-mist">{p.body}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] lg:mt-28 lg:grid-cols-4 [&>*]:bg-void [&>*]:ring-1 [&>*]:ring-white/[0.06]">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="relative p-6 sm:p-9">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(2.75rem,6vw,4.75rem)] leading-none font-bold tracking-[-0.04em]">
                  <Counter to={s.value} suffix={s.suffix} />
                </span>
                <span aria-hidden className="mt-4 block text-[15px] font-medium text-ink">
                  {s.label}
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-dim">{s.detail}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
