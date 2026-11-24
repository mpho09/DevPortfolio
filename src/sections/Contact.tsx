import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, FileDown, Mail, Send } from 'lucide-react'
import { useId, useState, type FormEvent, useRef } from 'react'
import { siGithub } from 'simple-icons'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { Reveal } from '@/components/ui/Reveal'
import { useParticleShape } from '@/lib/particleShape'
import { profile } from '@/data/profile'

function LinkedInIcon({ className }: { className?: string }) {
  // simple-icons no longer ships the LinkedIn mark, so it's inlined here
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

const timings = ['Urgent', 'In the near future', 'No rush'] as const
const topics = ['Developer role', 'Frontend build', 'Full-stack build', 'Other'] as const

const input =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-[15px] text-white placeholder:text-white/35 transition-[border-color,background-color] duration-300 outline-none focus:border-cyan/60 focus:bg-white/[0.06]'

function Choice({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2.5 text-sm transition-[border-color,background-color,color] duration-300 ${
        selected ? 'border-cyan/60 bg-cyan/15 text-white' : 'border-white/10 text-mist hover:border-white/30 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

function BriefForm() {
  const uid = useId()
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [timing, setTiming] = useState<(typeof timings)[number]>('In the near future')
  const [topic, setTopic] = useState<(typeof topics)[number]>('Developer role')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const next = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }
    const subject = `${topic}: message from ${name}`
    const body = [`Name: ${name}`, `Email: ${email}`, phone && `Phone: ${phone}`, `Timing: ${timing}`, `Topic: ${topic}`, '', message]
      .filter((l) => l !== '')
      .join('\n')
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <form onSubmit={next} className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10" aria-labelledby={`${uid}-title`}>
      <div className="flex items-center justify-between">
        <h3 id={`${uid}-title`} className="text-lg font-semibold tracking-[0.08em] uppercase">
          Let's begin!
        </h3>
        <span className="font-mono text-xs text-dim" aria-live="polite">
          Step {step} / 2
        </span>
      </div>
      <div className="mt-4 h-[2px] overflow-hidden rounded bg-white/10" aria-hidden>
        <motion.div
          className="h-full bg-[linear-gradient(90deg,#2563eb,#06b6d4)]"
          animate={{ width: step === 1 ? '50%' : '100%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="mt-8 grid gap-4"
          >
            <label className="grid gap-2 text-sm text-mist">
              Name
              <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="Your name" />
            </label>
            <label className="grid gap-2 text-sm text-mist">
              Email address
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2 text-sm text-mist">
              Phone number <span className="sr-only">(optional)</span>
              <input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={input} placeholder="Optional" />
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.35 }}
            className="mt-8 grid gap-6"
          >
            <button type="button" onClick={() => setStep(1)} className="inline-flex w-fit items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white">
              <ArrowLeft className="size-4" aria-hidden /> Back
            </button>
            <fieldset>
              <legend className="mb-3 text-sm text-mist">Timing</legend>
              <div className="flex flex-wrap gap-2">
                {timings.map((t) => (
                  <Choice key={t} label={t} selected={timing === t} onClick={() => setTiming(t)} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-3 text-sm text-mist">How can I help?</legend>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <Choice key={t} label={t} selected={topic === t} onClick={() => setTopic(t)} />
                ))}
              </div>
            </fieldset>
            <label className="grid gap-2 text-sm text-mist">
              Message
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${input} resize-none`}
                placeholder="Tell me about the role, idea or problem"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" className="flow-btn mt-8 w-full">
        {step === 1 ? (
          <>
            Next <ArrowRight className="size-5" aria-hidden />
          </>
        ) : (
          <>
            Send <Send className="size-4" aria-hidden />
          </>
        )}
      </button>
      <p role="status" className="mt-4 min-h-5 text-center text-xs text-dim">
        {sent ? 'Your email app should now open with the message ready to send.' : step === 2 ? 'This opens your email app with the message filled in.' : ''}
      </p>
    </form>
  )
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  useParticleShape(sectionRef, 'orbit')
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

  const links = [
    { label: 'GitHub', handle: '@mpho09', href: profile.github, icon: <BrandIcon icon={siGithub} className="size-5" /> },
    { label: 'LinkedIn', handle: 'in/mphomangena', href: profile.linkedin, icon: <LinkedInIcon className="size-5" /> },
  ]

  return (
    <section ref={sectionRef} id="contact" aria-labelledby="contact-title" className="relative py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.2),transparent_65%)] blur-2xl"
      />
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-24">
        <Reveal>
          <p className="section-badge mb-6">Contact</p>
          <h2 id="contact-title" className="text-[clamp(2.2rem,3vw+0.7rem,3.4rem)] leading-[1.15] font-bold tracking-[-0.01em]">
            Got an idea worth building?
            <span className="text-gradient mt-2 block">Let's make it real.</span>
          </h2>
          <div className="decorative-line my-8" />
          <p className="max-w-md text-[16.5px] leading-[1.8] text-mist">
            I'm open to developer roles, freelance builds and ambitious collaborations. Tell me what you have in mind and I'll get
            back to you.
          </p>

          <div className="mt-10 grid gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-3 text-lg text-white">
                <span className="grid size-11 place-items-center rounded-full border border-white/15 transition-colors group-hover:border-cyan/60 group-hover:bg-cyan/10">
                  <Mail className="size-5" aria-hidden />
                </span>
                <span className="break-all underline decoration-white/20 underline-offset-[6px] transition-colors group-hover:decoration-cyan">
                  {profile.email}
                </span>
              </a>
              <button
                type="button"
                onClick={copy}
                aria-label={`Copy email address ${profile.email}`}
                className="grid size-9 place-items-center rounded-full text-mist transition-colors hover:bg-white/5 hover:text-white"
              >
                {copied ? <Check className="size-4 text-cyan" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              </button>
              <span role="status" aria-live="polite" className="text-xs text-cyan">
                {copied ? 'Copied' : ''}
              </span>
            </div>

            <ul className="mt-4 flex flex-wrap gap-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/10 px-4 py-2 text-sm text-mist transition-colors hover:border-cyan/50 hover:text-white"
                  >
                    {l.icon}
                    {l.handle}
                    <ArrowUpRight className="size-4" aria-hidden />
                    <span className="sr-only">({l.label}, opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={profile.cv}
                  download
                  className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/10 px-4 py-2 text-sm text-mist transition-colors hover:border-cyan/50 hover:text-white"
                >
                  <FileDown className="size-5" aria-hidden />
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <BriefForm />
        </Reveal>
      </div>
    </section>
  )
}
