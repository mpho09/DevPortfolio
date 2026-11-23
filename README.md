# Mpho Mangena — Portfolio

An immersive, interactive 3D portfolio built with React, TypeScript and React Three Fiber.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS v4 · Three.js / React Three Fiber · Framer Motion · Lenis · Lucide

## Getting started

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Editing content

All copy lives in `src/data`, so you rarely need to touch components:

| File | What it controls |
| --- | --- |
| `src/data/profile.ts` | Name, email, social links, CV path, nav links, About statistics |
| `src/data/skills.ts` | Technology cards (icon, colour, category, description) |
| `src/data/projects.ts` | Featured projects (copy, tech, links, preview type) |
| `src/data/timeline.ts` | Experience, certifications, hackathons |

Project screenshots live in `public/projects` (WebP, 1440×900 for browser previews). The CV is in `public/cv`.

A project's `preview` can be:
- `{ kind: 'browser', src, url }`: a screenshot in a browser frame
- `{ kind: 'phones', srcs: [a, b] }`: two mobile screens in device frames
- `{ kind: 'weserva' }`: a hand-built interface preview (for projects without a public deployment)

Set `githubPrivate: true` to show a "Private repo" badge instead of a link that visitors can't open.

## Structure

```
src/
  components/
    three/        HeroScene (lazy-loaded WebGL) + GLSL shaders
    layout/       Navbar, Footer
    ui/           Button (magnetic), TiltCard, Reveal, SectionHeading, BrandIcon
    ContactBackground.tsx   interactive 2D-canvas dot field
    ProjectPreview.tsx      browser / phone / custom preview frames
  sections/       Hero, About, Skills, Projects, Experience, Contact
  hooks/          useActiveSection, useMediaQuery
  lib/            smooth scrolling (Lenis) + global pointer store
  data/           all site content
```

## Performance & accessibility notes

- The 3D scene is code-split. Text paints first, and three.js loads in parallel.
- WebGL stops rendering when the hero is off-screen. Quality (geometry detail, particle count, DPR) drops on small or low-core devices.
- Glow and bloom are faked with additive sprites rather than a post-processing pass.
- `prefers-reduced-motion` disables smooth scrolling, slows the 3D scene and removes motion transitions.
- Semantic landmarks, skip link, visible focus rings, keyboard-operable menu (Escape closes) and labelled external links.

## Deploying

It's a static site, so deploy `dist/` to Vercel, Netlify or GitHub Pages. On Vercel, import the repo and the defaults (`npm run build`, output `dist`) work as-is.
