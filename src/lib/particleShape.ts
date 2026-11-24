import { useEffect, type RefObject } from 'react'

/** Shapes the background particle cloud can morph into. */
export type ParticleShape = 'ring' | 'helix' | 'sphere' | 'galaxy' | 'monogram' | 'orbit'

// A tiny global store: sections write the shape, the WebGL loop reads it every frame
let current: ParticleShape = 'ring'

export const particleShape = {
  get: () => current,
  set: (s: ParticleShape) => {
    current = s
  },
}

/** Switches the particle cloud to `shape` while this section crosses the middle of the viewport. */
export function useParticleShape(ref: RefObject<HTMLElement | null>, shape: ParticleShape) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) particleShape.set(shape)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, shape])
}
