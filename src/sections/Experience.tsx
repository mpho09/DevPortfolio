import { motion, useScroll, useSpring } from 'framer-motion'
import { Briefcase, GraduationCap, Trophy, UsersRound, type LucideIcon } from 'lucide-react'
import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { timeline, timelineKinds, type TimelineItem, type TimelineKind } from '@/data/timeline'

const kindStyle: Record<TimelineKind, { icon: LucideIcon; color: string }> = {
  work: { icon: Briefcase, color: '#3d7bff' },
  certification: { icon: GraduationCap, color: '#22d3ee' },
  hackathon: { icon: Trophy, color: '#f5b84b' },
  collaboration: { icon: UsersRound, color: '#8b5cf6' },
}

function Entry({ item, index }: { item: TimelineItem; index: number }) {
  const { icon: Icon, color } = kindStyle[item.kind]
  const right = index % 2 === 1
  return (
    <li className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 md:grid-cols-[1fr_3rem_1fr] md:gap-x-8">
      {/* Node on the line */}
      <div className="relative col-start-1 row-span-2 flex justify-center md:col-start-2">
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -30% 0px' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative z-10 mt-6 grid size-10 place-items-center rounded-full bg-void ring-1 md:size-12"
          style={{ ['--tw-ring-color' as string]: `${color}66`, boxShadow: `0 0 30px -4px ${color}88` }}
        >
          <Icon className="size-4 md:size-5" style={{ color }} aria-hidden />
        </motion.span>
      </div>

      <motion.article
        initial={{ opacity: 0, x: right ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`glass group col-start-2 row-start-1 mb-10 rounded-3xl p-6 transition-colors duration-500 hover:border-white/20 sm:p-7 md:mb-14 ${
          right ? 'md:col-start-3' : 'md:col-start-1 md:text-right'
        }`}
      >
        <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${right ? '' : 'md:justify-end'}`}>
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[10.5px] tracking-[0.14em] uppercase"
            style={{ color, background: `${color}14`, boxShadow: `inset 0 0 0 1px ${color}33` }}
          >
            {timelineKinds[item.kind]}
          </span>
          <span className="font-mono text-xs text-dim">{item.period}</span>
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight sm:text-2xl">{item.title}</h3>
        <p className="mt-1 text-sm font-medium text-ink/70">{item.org}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-mist text-pretty">{item.description}</p>
      </motion.article>
    </li>
  )
}

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.7', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="04"
          eyebrow="Experience & achievements"
          id="journey-title"
          title={
            <>
              The <span className="text-gradient">journey</span> so far.
            </>
          }
          intro="From the server room to leading product teams: client support, systems work, certifications, hackathon finals and collaborative builds."
        />

        <ul aria-label="Legend" className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
          {(Object.keys(kindStyle) as TimelineKind[]).map((k) => (
            <li key={k} className="flex items-center gap-2 text-[13px] text-mist">
              <span className="size-2 rounded-full" style={{ background: kindStyle[k].color }} aria-hidden />
              {timelineKinds[k]}
            </li>
          ))}
        </ul>

        <div className="relative mt-14 lg:mt-20">
          {/* Track + scroll-linked glowing fill */}
          <div aria-hidden className="absolute top-0 bottom-0 left-5 w-px bg-white/[0.08] md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="h-full w-full origin-top bg-[linear-gradient(180deg,#3d7bff,#8b5cf6,#22d3ee)] shadow-[0_0_14px_rgba(139,92,246,0.9)]"
              style={{ scaleY: fill }}
            />
          </div>
          <ol ref={listRef} className="relative">
            {timeline.map((item, i) => (
              <Entry key={item.title} item={item} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
