import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TiltCard } from '@/components/ui/TiltCard'
import { skillCategories, skills, type Skill } from '@/data/skills'

type Filter = (typeof skillCategories)[number]

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const icons = Array.isArray(skill.icon) ? skill.icon : [skill.icon]
  return (
    <TiltCard max={10} glow={`${skill.color}2e`} className="h-full rounded-3xl">
      <article
        className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-[border-color] duration-500 group-hover/tilt:border-white/20 [transform-style:preserve-3d]"
        style={{ ['--c' as string]: skill.color }}
      >

        <div className="relative flex items-start justify-between [transform:translateZ(50px)]">
          <div className="flex -space-x-2">
            {icons.map((ic) => (
              <span
                key={ic.slug}
                className="grid size-14 place-items-center rounded-2xl ring-1 transition-[transform,box-shadow] duration-500 group-hover/tilt:-translate-y-1 group-hover/tilt:shadow-[0_12px_40px_-6px_var(--c)]"
                style={{
                  background: `linear-gradient(145deg, ${skill.color}26, ${skill.color}0d)`,
                  ['--tw-ring-color' as string]: `${skill.color}40`,
                }}
              >
                <BrandIcon icon={ic} className="size-7" color={skill.color} />
              </span>
            ))}
          </div>
          <span className="font-mono text-[11px] text-dim">{String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className="relative mt-8 [transform:translateZ(30px)]">
          <h3 className="font-display text-xl font-semibold tracking-tight">{skill.name}</h3>
          <p className="mt-1 font-mono text-[10.5px] tracking-[0.18em] text-dim uppercase">{skill.category}</p>
        </div>
        <p className="relative mt-4 text-[14.5px] leading-relaxed text-mist [transform:translateZ(20px)]">{skill.description}</p>

        <span
          aria-hidden
          className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover/tilt:scale-x-100"
          style={{ background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)` }}
        />
      </article>
    </TiltCard>
  )
}

export function Skills() {
  const [filter, setFilter] = useState<Filter>('All')
  const visible = skills.filter((s) => filter === 'All' || s.category === filter)

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(61,123,255,0.09),transparent_65%)]" />
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Technical skills"
          id="skills-title"
          title={
            <>
              The <span className="text-gradient">toolkit</span> behind the work.
            </>
          }
          intro="A focused stack I use to take ideas from wireframe to production, from pixel-perfect interfaces to secure databases and real-time 3D."
        />

        <div role="group" aria-label="Filter skills by category" className="mt-14 flex flex-wrap gap-2">
          {skillCategories.map((c) => {
            const active = c === filter
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={active}
                className={`relative isolate rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                  active ? 'text-white' : 'text-mist hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="skill-filter"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-electric/40 to-violet/40 ring-1 ring-white/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {c}
                <span className="ml-2 font-mono text-[10px] text-dim">
                  {c === 'All' ? skills.length : skills.filter((s) => s.category === c).length}
                </span>
              </button>
            )
          })}
        </div>

        <motion.ul layout className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((skill) => (
              <motion.li
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (skills.indexOf(skill) % 4) * 0.06 }}
              >
                <SkillCard skill={skill} index={skills.indexOf(skill)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}
