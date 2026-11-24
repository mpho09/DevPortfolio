import { Layers, LifeBuoy, MonitorSmartphone, ServerCog, type LucideIcon } from 'lucide-react'

export interface Service {
  title: string
  icon: LucideIcon
  description: string
  stack: string[]
}

export const services: Service[] = [
  {
    title: 'Frontend development',
    icon: MonitorSmartphone,
    description:
      'Fast, accessible and responsive interfaces in React and Next.js, with clean components, typed props and motion that adds meaning rather than noise.',
    stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS'],
  },
  {
    title: 'Backend & data',
    icon: ServerCog,
    description:
      'REST APIs in Node.js and Express, Postgres schemas with row-level security, auth and tested policies, plus Firebase for rapid MVPs.',
    stack: ['Node.js', 'Express', 'Supabase', 'PostgreSQL', 'MySQL', 'Firebase'],
  },
  {
    title: 'Product & team leadership',
    icon: Layers,
    description:
      'From PRD to production: scoping what to build and what not to, breaking work into small tested steps and leading a team on a GitHub project board.',
    stack: ['PRDs', 'Git & GitHub', 'Code review', 'Jest', 'Vercel'],
  },
  {
    title: 'Systems & support',
    icon: LifeBuoy,
    description:
      'Years of installing systems, monitoring networks and supporting hosting clients mean I build software with the people who run and use it in mind.',
    stack: ['Hosting & domains', 'Networking', 'User access', 'Troubleshooting'],
  },
]
