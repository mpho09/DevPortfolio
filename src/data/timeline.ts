export type TimelineKind = 'work' | 'certification' | 'hackathon' | 'collaboration'

export interface TimelineItem {
  period: string
  title: string
  org: string
  kind: TimelineKind
  description: string
}

export const timelineKinds: Record<TimelineKind, string> = {
  work: 'Experience',
  certification: 'Certification',
  hackathon: 'Hackathon',
  collaboration: 'Team project',
}

export const timeline: TimelineItem[] = [
  {
    period: '2026',
    title: 'AI Software Engineering',
    org: 'Melsoft Academy',
    kind: 'certification',
    description:
      'An intensive full-stack programme in React, TypeScript, Node.js and AI-assisted engineering, delivered through real team projects such as the Riverside Community Hub booking and donations platform.',
  },
  {
    period: '2026',
    title: 'Tech Lead, Queueless',
    org: 'Team CoPilot',
    kind: 'collaboration',
    description:
      'Led a cross-functional team using a PRD-first workflow and a GitHub project board. I owned the database schema, row-level security, tests and the core product search.',
  },
  {
    period: '2026',
    title: 'WeServa & HerPath',
    org: 'Hackathon & team builds',
    kind: 'hackathon',
    description:
      'Shipped two collaborative products on tight deadlines: an AI-matched service marketplace and an economic-empowerment platform for women with an AI business coach.',
  },
  {
    period: 'Finalist',
    title: 'Top 3 Finalist',
    org: 'SheCodes Rising Hackathon',
    kind: 'hackathon',
    description: 'Reached the final three with a product pitched and built under hackathon pressure.',
  },
  {
    period: 'Finalist',
    title: 'Top 10 Finalist',
    org: 'GirlCode Hackathon',
    kind: 'hackathon',
    description: 'Selected as a top-ten team, building a working prototype from idea to demo.',
  },
  {
    period: 'Apr – Jul 2025',
    title: 'Technical & Client Support, Web Hosting',
    org: 'Afrihost',
    kind: 'work',
    description:
      'Supported web hosting clients on BillRun with domain setup, email configuration, billing and troubleshooting, resolving issues fast so their websites stayed online.',
  },
  {
    period: '2025',
    title: 'System Support, NQF Level 5',
    org: 'Boundless Academy',
    kind: 'certification',
    description: 'Formal qualification in systems support, networking and enterprise IT operations.',
  },
  {
    period: 'Jan 2024 – Mar 2025',
    title: 'System Support',
    org: 'Boundless Consulting · Sandton',
    kind: 'work',
    description:
      'Installed and configured operating systems and enterprise apps, monitored performance and networks, applied patches and managed user access and permissions.',
  },
  {
    period: 'Apr – Dec 2023',
    title: 'Web Developer Trainee',
    org: 'AVO Managed Solutions · Randburg',
    kind: 'work',
    description:
      'Where my development journey started: HTML, CSS, Git, debugging tools and WordPress, inside a collaborative team workflow.',
  },
  {
    period: '2022',
    title: 'Azure Fundamentals & Oracle Java SE 8',
    org: 'Microsoft · Oracle',
    kind: 'certification',
    description: 'Certified foundations in cloud computing and object-oriented programming in Java.',
  },
]
