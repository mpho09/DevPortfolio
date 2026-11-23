export const profile = {
  name: 'Mpho Mangena',
  firstName: 'Mpho',
  lastName: 'Mangena',
  role: 'Software Developer',
  location: 'Midrand, Johannesburg',
  email: 'mphomangena0409@gmail.com',
  github: 'https://github.com/mpho09',
  linkedin: 'https://www.linkedin.com/in/mphomangena',
  cv: '/cv/Mpho_Mangena_CV.pdf',
  availability: 'Open to developer roles',
} as const

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof navLinks)[number]['id'] | 'top'

export const stats = [
  { value: 20, suffix: '+', label: 'Projects built & shipped', detail: 'Solo, team and hackathon builds on GitHub' },
  { value: 12, suffix: '+', label: 'Technologies', detail: 'Across frontend, backend, data and 3D' },
  { value: 6, suffix: '', label: 'Achievements', detail: 'Certifications and hackathon finals' },
  { value: 3, suffix: '+', label: 'Years in tech', detail: 'Development, systems and client support' },
] as const
