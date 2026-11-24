import { lazy, Suspense } from 'react'

// three.js is code-split so the page text paints before the particle cloud loads
const ParticleField = lazy(() => import('@/components/three/ParticleField'))

/** Fixed ambient layer behind the whole site: drifting colour orbs, a 3D particle cloud, film grain and faint cyan glow lines. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="gradient-orb top-[-200px] right-[-100px] size-[300px] bg-electric/70 sm:size-[600px]" />
      <div className="gradient-orb bottom-[-150px] left-[-100px] size-[250px] bg-cyan/40 [animation-delay:-7s] sm:size-[500px]" />
      <div className="gradient-orb top-[40%] left-[30%] size-[200px] bg-violet/35 [animation-delay:-14s] sm:size-[400px]" />
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
      <div className="noise-overlay" />
      <div className="glow-line-top" />
      <div className="glow-line-left hidden lg:block" />
    </div>
  )
}
