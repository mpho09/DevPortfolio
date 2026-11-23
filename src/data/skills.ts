import {
  siCss,
  siFirebase,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  type SimpleIcon,
} from 'simple-icons'

export type SkillCategory = 'Frontend' | 'Backend & Data' | 'Tools & 3D'

export interface Skill {
  name: string
  icon: SimpleIcon | SimpleIcon[]
  /** Accent used for the glow; brand colour, lifted for dark backgrounds where needed */
  color: string
  category: SkillCategory
  description: string
}

export const skillCategories: Array<'All' | SkillCategory> = ['All', 'Frontend', 'Backend & Data', 'Tools & 3D']

export const skills: Skill[] = [
  {
    name: 'HTML',
    icon: siHtml5,
    color: '#E34F26',
    category: 'Frontend',
    description: 'Semantic, accessible markup as the foundation of every interface.',
  },
  {
    name: 'CSS',
    icon: siCss,
    color: '#8b6cff',
    category: 'Frontend',
    description: 'Modern layouts with grid, flexbox, custom properties and motion.',
  },
  {
    name: 'JavaScript',
    icon: siJavascript,
    color: '#F7DF1E',
    category: 'Frontend',
    description: 'Interactive, event-driven logic for the browser and the server.',
  },
  {
    name: 'React',
    icon: siReact,
    color: '#61DAFB',
    category: 'Frontend',
    description: 'Component-driven UIs with hooks, context and typed props.',
  },
  {
    name: 'Next.js',
    icon: siNextdotjs,
    color: '#e8ecff',
    category: 'Frontend',
    description: 'Full-stack React with server rendering, routing and API routes.',
  },
  {
    name: 'Tailwind CSS',
    icon: siTailwindcss,
    color: '#38BDF8',
    category: 'Frontend',
    description: 'Utility-first design systems that stay consistent and fast to build.',
  },
  {
    name: 'Node.js',
    icon: siNodedotjs,
    color: '#5FA04E',
    category: 'Backend & Data',
    description: 'REST APIs with Express, auth middleware and role-based access.',
  },
  {
    name: 'Supabase',
    icon: siSupabase,
    color: '#3FCF8E',
    category: 'Backend & Data',
    description: 'Postgres schemas, row-level security, auth and tested policies.',
  },
  {
    name: 'MySQL',
    icon: siMysql,
    color: '#5b9bd5',
    category: 'Backend & Data',
    description: 'Relational modelling, joins and well-structured queries.',
  },
  {
    name: 'Firebase',
    icon: siFirebase,
    color: '#FFA000',
    category: 'Backend & Data',
    description: 'Realtime data, authentication and hosting for rapid MVPs.',
  },
  {
    name: 'Git & GitHub',
    icon: [siGit, siGithub],
    color: '#F05032',
    category: 'Tools & 3D',
    description: 'Branching, pull requests, code review and project boards in teams.',
  },
  {
    name: 'Three.js',
    icon: siThreedotjs,
    color: '#a5b4ff',
    category: 'Tools & 3D',
    description: 'Real-time 3D on the web with React Three Fiber and custom shaders.',
  },
]
