# Mpho Mangena: Developer Portfolio

**Live site → [dev-portfolio-sigma-nine.vercel.app](https://dev-portfolio-sigma-nine.vercel.app)**

My personal portfolio: a dark, motion-driven website showing my services, projects and journey as a software developer based in Johannesburg.

[![Portfolio hero section](docs/preview.jpg)](https://dev-portfolio-sigma-nine.vercel.app)

![React](https://img.shields.io/badge/React_19-20232a?logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-0f172a?logo=tailwindcss&logoColor=38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055ff?logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?logo=vercel&logoColor=white)

## Highlights

- **Living particle background.** A fixed three.js cloud of thousands of points that assembles on load, slowly rotates, scatters away from your cursor and changes shape for each section: a ring in the hero, a helix, the "M" monogram, a sphere and orbit rings at Contact. Drifting glow orbs, film grain and cyan glow lines sit behind it.
- **Typographic hero.** A bottom-aligned headline with an animated gradient name, a gradient pill call to action and a rotating hackathon-finalist badge.
- **Project slider.** A swipeable, snap-scrolling track of project cards with previous/next arrows.
- **Two-step contact brief.** Name and email first, then timing, topic and message, which opens the visitor's email app pre-filled.
- **Smooth, polished motion.** Lenis smooth scrolling, an animated nav underline, a glass nav pill on scroll and staggered reveals.

## Sections

| Section | What's inside |
| --- | --- |
| **Hero** | Name, headline, description, call to action and finalist badge |
| **About** | Centred intro, my story from systems support to development, and animated stats |
| **Services** | Frontend, backend & data, product & leadership, and systems & support, each with its tools |
| **Projects** | WeServa, LifeNest, HerPath and Queueless, with previews, tech stacks and links |
| **Journey** | Experience, certifications, hackathon finals and team projects |
| **Contact** | Two-step brief form, email (with copy), GitHub, LinkedIn and CV download |

## Built with

| | |
| --- | --- |
| **Framework** | React 19, TypeScript, Vite |
| **3D** | Three.js (particle background, lazy-loaded) |
| **Styling** | Tailwind CSS v4, glassmorphism, self-hosted variable fonts (Sora, JetBrains Mono) |
| **Animation** | Framer Motion, Lenis |
| **Icons** | Lucide React, Simple Icons |
| **Hosting** | Vercel |

## Performance and accessibility

- **Fast first paint.** three.js is code-split and loads after the text renders; without WebGL the CSS glow orbs remain.
- **No wasted rendering.** The particle loop pauses while the tab is hidden, and phones get half the particles and a lower pixel ratio.
- **Reduced motion.** With `prefers-reduced-motion` turned on, smooth scrolling, ambient animation and the pinned phone scene are switched off.
- **Accessible.** Semantic landmarks, a skip link, visible focus rings, a keyboard-friendly mobile menu (Escape closes it), and labelled links and images.

## Running locally

Requires **Node.js 20+**.

```sh
git clone https://github.com/mpho09/DevPortfolio.git
cd DevPortfolio
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Run the TypeScript checker only |

## Editing content

All of the site's text lives in `src/data`, so updating content doesn't mean touching components:

| File | Controls |
| --- | --- |
| `src/data/profile.ts` | Name, email, social links, CV path, navigation, About stats |
| `src/data/services.ts` | Service cards: title, icon, description and tools |
| `src/data/projects.ts` | Featured projects: copy, tech, links and preview type |
| `src/data/timeline.ts` | Experience, certifications and hackathons |

**Images:** project screenshots go in `public/projects/` (WebP, 1440×900 for browser previews) and the CV goes in `public/cv/`.

**Project previews:** each project's `preview` field can be one of:

- `{ kind: 'browser', src, url }`: a screenshot inside a browser frame
- `{ kind: 'phones', srcs: [a, b] }`: two mobile screens in phone frames
- `{ kind: 'weserva' }`: a hand-built interface preview, for projects without a public deployment

Set `githubPrivate: true` on a project to show a "Private repo" badge instead of a link visitors can't open.

## Project structure

```
src/
├── components/
│   ├── three/              ParticleField (lazy-loaded WebGL background)
│   ├── layout/             Navbar, Footer, Backdrop
│   ├── ui/                 Reveal, BrandIcon
│   └── ProjectPreview      Browser, phone and custom preview frames
├── sections/               Hero, About, Services, Projects, Journey, Contact
├── hooks/                  useActiveSection, useMediaQuery
├── lib/                    Smooth scrolling
├── data/                   All site content
├── App.tsx
└── main.tsx
```

## Deployment

The site deploys to Vercel automatically on every push to `master`. Build settings are pinned in [`vercel.json`](vercel.json) (Vite preset, `npm run build`, output `dist/`), so no dashboard configuration is needed.

To deploy elsewhere, run `npm run build` and host the `dist/` folder on any static host, such as Netlify, GitHub Pages or Cloudflare Pages.

## Contact

**Mpho Mangena**, Software Developer, Midrand, Johannesburg

- Email: [mphomangena0409@gmail.com](mailto:mphomangena0409@gmail.com)
- LinkedIn: [linkedin.com/in/mphomangena](https://www.linkedin.com/in/mphomangena)
- GitHub: [@mpho09](https://github.com/mpho09)

---

© 2026 Mpho Mangena. The code is free to read and learn from. Please don't republish the site, its content or its design as your own.
