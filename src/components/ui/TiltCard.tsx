import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Maximum rotation in degrees */
  max?: number
  /** Colour of the cursor-following spotlight */
  glow?: string
  style?: CSSProperties
}

/**
 * A card that tilts in 3D towards the cursor and casts a soft spotlight where
 * the pointer is. Children can use `translateZ` (e.g. `[transform:translateZ(40px)]`)
 * to float above the surface. Tilt is disabled on touch and for reduced motion.
 */
export function TiltCard({ children, className = '', max = 8, glow = 'rgba(61,123,255,0.22)', style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 160, damping: 18, mass: 0.4 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
  const gx = useTransform(px, (v) => `${v * 100}%`)
  const gy = useTransform(py, (v) => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, ${glow}, transparent 60%)`

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="[perspective:1200px]" style={style}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={enabled ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        className={`group/tilt relative ${className}`}
      >
        {enabled && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 mix-blend-screen transition-opacity duration-500 group-hover/tilt:opacity-100"
            style={{ background: spotlight }}
          />
        )}
        {children}
      </motion.div>
    </div>
  )
}
