import { BadgeCheck, Lock, MapPin, Search, Sparkles, Star } from 'lucide-react'
import type { Project } from '@/data/projects'

function BrowserFrame({ src, url, alt }: { src: string; url: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#0c0e16] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <div className="mx-auto flex max-w-[70%] items-center gap-1.5 truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-dim">
          <Lock className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{url}</span>
        </div>
      </div>
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={src}
          alt={alt}
          width={1440}
          height={900}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
        />
      </div>
    </div>
  )
}

function PhoneFrame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`w-[44%] max-w-[230px] rounded-[2rem] bg-[#0c0e16] p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/15 ${className}`}>
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.6rem] bg-[#f7f5f0]">
        <img src={src} alt={alt} loading="lazy" decoding="async" className="size-full object-cover object-top" />
        <span aria-hidden className="absolute top-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}

/** Recreates WeServa's interface in its own brand palette, since it has no public deployment yet. */
function WeServaPreview() {
  const providers = [
    { initials: 'NM', name: 'Nomsa M.', service: 'Deep cleaning', rating: '4.9', price: 'R280/h', match: 98 },
    { initials: 'TK', name: 'Thabo K.', service: 'Plumbing repairs', rating: '4.8', price: 'R350/h', match: 94 },
    { initials: 'LD', name: 'Lebo D.', service: 'Maths tutoring', rating: '5.0', price: 'R220/h', match: 91 },
  ]
  return (
    <div
      role="img"
      aria-label="WeServa interface preview: AI-matched search results showing verified service providers with ratings and prices"
      className="overflow-hidden rounded-2xl bg-[#f6f8fa] text-[#1b2430] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
    >
      <div className="flex items-center justify-between bg-[#0f5c52] px-5 py-3 text-[#eaf6f2]">
        <span className="font-display text-sm font-bold tracking-tight">
          We<span className="text-[#d6fff0]">Serva</span>
        </span>
        <div className="hidden gap-4 text-[11px] opacity-80 sm:flex">
          <span>Services</span>
          <span>Become a provider</span>
          <span>Bookings</span>
        </div>
        <span className="grid size-6 place-items-center rounded-full bg-white/15 text-[10px]">K</span>
      </div>
      <div className="aspect-[16/10] space-y-3 p-4 sm:p-5">
        <div>
          <p className="text-[10px] font-semibold tracking-wider text-[#0f5c52] uppercase">Trusted local pros</p>
          <p className="font-display text-lg leading-tight font-bold sm:text-xl">Who do you need today?</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#e2e6ea] bg-white p-1.5 pl-3 text-[11px] shadow-sm">
          <Search className="size-3.5 text-[#5b6674]" aria-hidden />
          <span className="flex-1 truncate text-[#5b6674]">A cleaner for a 3-bed home this Saturday</span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#0f5c52] px-2.5 py-1.5 font-medium text-white">
            <Sparkles className="size-3" aria-hidden /> AI match
          </span>
        </div>
        <div className="flex gap-1.5 overflow-hidden text-[10px]">
          {['Cleaning', 'Repairs', 'Tutoring', 'Tech support', 'Wellness'].map((c, i) => (
            <span key={c} className={`shrink-0 rounded-full px-2 py-0.5 ${i === 0 ? 'bg-[#0f5c52] text-white' : 'bg-[#eef0f3] text-[#5b6674]'}`}>
              {c}
            </span>
          ))}
        </div>
        <div className="grid gap-2">
          {providers.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 rounded-xl border border-[#e2e6ea] bg-white p-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e4f2ef] text-[11px] font-bold text-[#0f5c52]">
                {p.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-[12px] font-semibold">
                  {p.name} <BadgeCheck className="size-3.5 text-[#1a7f4a]" aria-hidden />
                </p>
                <p className="flex items-center gap-2 text-[10px] text-[#5b6674]">
                  {p.service}
                  <span className="inline-flex items-center gap-0.5">
                    <Star className="size-2.5 fill-[#d98527] text-[#d98527]" aria-hidden /> {p.rating}
                  </span>
                  <span className="hidden items-center gap-0.5 sm:inline-flex">
                    <MapPin className="size-2.5" aria-hidden /> {2 + i} km
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold">{p.price}</p>
                <p className="text-[9.5px] font-medium text-[#0f5c52]">{p.match}% match</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProjectPreview({ project }: { project: Project }) {
  const { preview, name } = project
  switch (preview.kind) {
    case 'browser':
      return <BrowserFrame src={preview.src} url={preview.url} alt={`Screenshot of the ${name} web app`} />
    case 'phones':
      return (
        <div className="flex items-start justify-center gap-4 py-2 sm:gap-6">
          <PhoneFrame
            src={preview.srcs[0]}
            alt={`${name} mobile screen`}
            className="transition-transform duration-700 group-hover:-translate-y-2 group-hover:-rotate-2"
          />
          <PhoneFrame
            src={preview.srcs[1]}
            alt={`${name} vault security setup screen`}
            className="mt-12 transition-transform duration-700 group-hover:translate-y-1 group-hover:rotate-2"
          />
        </div>
      )
    case 'weserva':
      return <WeServaPreview />
  }
}
