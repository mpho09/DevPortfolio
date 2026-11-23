import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  id?: string
}

export function SectionHeading({ index, eyebrow, title, intro, id }: SectionHeadingProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <Reveal className="lg:col-span-7">
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="text-cyan">{index}</span>
          <span aria-hidden className="h-px w-10 bg-gradient-to-r from-cyan to-transparent" />
          {eyebrow}
        </p>
        <h2
          id={id}
          className="font-display text-[clamp(2.4rem,6vw,5.25rem)] leading-[0.95] font-bold tracking-[-0.035em] text-balance"
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1} className="lg:col-span-5 lg:pb-3">
          <p className="max-w-md text-[17px] leading-relaxed text-mist text-pretty">{intro}</p>
        </Reveal>
      )}
    </div>
  )
}
