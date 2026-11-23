export type ProjectPreview =
  | { kind: 'browser'; src: string; url: string }
  | { kind: 'phones'; srcs: [string, string] }
  | { kind: 'weserva' }

export interface Project {
  slug: string
  name: string
  kicker: string
  tagline: string
  description: string
  role: string
  tech: string[]
  github: string
  /** Private repos can't be opened by visitors, so the UI shows a badge instead of a dead link */
  githubPrivate?: boolean
  live?: string
  accent: string
  preview: ProjectPreview
}

export const projects: Project[] = [
  {
    slug: 'weserva',
    name: 'WeServa',
    kicker: 'Hackathon MVP · Team build',
    tagline: 'A trusted service marketplace with AI-assisted matching.',
    description:
      'WeServa connects customers with verified service providers for cleaning, repairs, tutoring, tech support, wellness and more. The MVP covers the whole flow: provider verification, search and AI matching, booking and scheduling, Stripe payments, notifications, reviews and a provider earnings dashboard.',
    role: 'Full-stack contributor, spec-driven build across 15 feature specs',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'Firebase', 'Stripe', 'AI matching'],
    github: 'https://github.com/sphllzulu/WeServa',
    githubPrivate: true,
    accent: '#22d3ee',
    preview: { kind: 'weserva' },
  },
  {
    slug: 'lifenest',
    name: 'LifeNest',
    kicker: 'Product · From PRD to production',
    tagline: 'A secure vault for the information that matters most.',
    description:
      'A private app for adults in South Africa to keep important documents, asset details, instructions and an emergency profile in one secure vault, then release them safely to trusted contacts. I took it from the product requirements and 25 screen designs through to a tested, deployed product.',
    role: 'Product owner and developer',
    tech: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'React Three Fiber', 'Jest'],
    github: 'https://github.com/mpho09/lifenest',
    live: 'https://lifenest-psi.vercel.app',
    accent: '#8b5cf6',
    preview: { kind: 'phones', srcs: ['/projects/lifenest-s1.webp', '/projects/lifenest-s5.webp'] },
  },
  {
    slug: 'herpath',
    name: 'HerPath',
    kicker: 'Team build · Social impact',
    tagline: "Turn what you have into what's next.",
    description:
      'An economic-empowerment journey for women, from skills to financial confidence to opportunity and income. It brings together budgeting, learning games, a verifiable work passport, opportunity matching and Thandi, an AI business coach. Read-aloud, voice input and larger text keep it accessible.',
    role: 'Collaborator, frontend and product features',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'Claude API', 'Lucide'],
    github: 'https://github.com/LeratoDaisy/her_path',
    live: 'https://her-path-puce.vercel.app',
    accent: '#a78bfa',
    preview: { kind: 'browser', src: '/projects/herpath.webp', url: 'her-path-puce.vercel.app' },
  },
  {
    slug: 'queueless',
    name: 'Queueless',
    kicker: 'Team CoPilot · Tech Lead',
    tagline: 'Find the cheapest store near you before you leave home.',
    description:
      'Queueless brings prices, stock availability and queue information from nearby stores into one place. As tech lead and backend developer, I designed the Postgres schema and row-level security, wrote the RLS tests and seed data, and built the product search function and the store queue view.',
    role: 'Tech Lead and backend developer',
    tech: ['React', 'Node.js', 'Supabase', 'PostgreSQL', 'Row-Level Security', 'Vercel'],
    github: 'https://github.com/mpho09/Queueless',
    live: 'https://queueless-copilot.vercel.app',
    accent: '#3d7bff',
    preview: { kind: 'browser', src: '/projects/queueless.webp', url: 'queueless-copilot.vercel.app' },
  },
]
