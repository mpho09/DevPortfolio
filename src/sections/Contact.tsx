import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, FileDown, Mail } from 'lucide-react'
import { useState } from 'react'
import { siGithub } from 'simple-icons'
import { ContactBackground } from '@/components/ContactBackground'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { profile } from '@/data/profile'

function LinkedInIcon({ className }: { className?: string }) {
  // simple-icons no longer ships the LinkedIn mark, so it's inlined here
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

const socials = [
  {
    label: 'GitHub',
    handle: '@mpho09',
    href: profile.github,
    icon: <BrandIcon icon={siGithub} className="size-5" />,
  },
  {
    label: 'LinkedIn',
    handle: 'in/mphomangena',
    href: profile.linkedin,
    icon: <LinkedInIcon className="size-5" />,
  },
]

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-32 sm:py-44">
      <ContactBackground />
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_65%)] blur-2xl" />

      <div className="container-x text-center">
        <Reveal>
          <p className="eyebrow mb-8 inline-flex items-center gap-3">
            <span className="text-cyan">05</span>
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-cyan to-transparent" />
            Contact
          </p>
          <h2
            id="contact-title"
            className="mx-auto max-w-[14ch] font-display text-[clamp(2.6rem,7.5vw,6.5rem)] leading-[0.95] font-bold tracking-[-0.045em] text-balance"
          >
            Let's build something <span className="text-gradient">meaningful.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-mist text-pretty">
            I'm open to developer roles, freelance builds and ambitious collaborations. If you have an idea, a team or a problem
            worth solving, I'd love to hear about it.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href={`mailto:${profile.email}`} icon={<ArrowUpRight className="size-4" aria-hidden />}>
              <Mail className="size-4" aria-hidden /> Email me
            </Button>
            <button
              type="button"
              onClick={copy}
              className="glass inline-flex min-h-12 items-center gap-2.5 rounded-full px-5 py-3 font-mono text-[13px] text-mist transition-colors hover:border-white/25 hover:text-ink"
              aria-label={`Copy email address ${profile.email}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'done' : 'copy'}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                >
                  {copied ? <Check className="size-4 text-cyan" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                </motion.span>
              </AnimatePresence>
              {profile.email}
            </button>
          </div>
          <p role="status" aria-live="polite" className="h-5 font-mono text-xs text-cyan">
            {copied ? 'Email copied to clipboard' : ''}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-white/[0.06] text-ink transition-colors group-hover:bg-white group-hover:text-void">
                    {s.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="block font-mono text-xs text-dim">{s.handle}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-dim transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.cv}
                download
                className="glass group flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-white/[0.06] text-ink transition-colors group-hover:bg-white group-hover:text-void">
                  <FileDown className="size-5" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">Résumé</span>
                  <span className="block font-mono text-xs text-dim">PDF · 3 pages</span>
                </span>
                <ArrowUpRight className="size-4 rotate-90 text-dim transition-all group-hover:text-ink" aria-hidden />
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
