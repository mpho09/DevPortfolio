import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, type ReactNode, type MouseEvent } from 'react'
import { useFinePointer } from '@/hooks/useMediaQuery'

type Variant = 'primary' | 'ghost'

interface ButtonProps {
  href: string
  children: ReactNode
  variant?: Variant
  icon?: ReactNode
  external?: boolean
  download?: boolean
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  className?: string
  ariaLabel?: string
}

const styles: Record<Variant, string> = {
  primary:
    'text-white bg-[linear-gradient(110deg,#3d7bff,#8b5cf6_55%,#22d3ee)] bg-[length:200%_100%] bg-left hover:bg-right shadow-[0_10px_40px_-10px_rgba(99,102,241,0.75)] hover:shadow-[0_18px_60px_-12px_rgba(139,92,246,0.9)]',
  ghost: 'glass text-ink hover:border-white/25 hover:bg-white/[0.08]',
}

/** A magnetic call-to-action link: drifts toward the cursor on hover (fine pointers only). */
export function Button({
  href,
  children,
  variant = 'primary',
  icon,
  external,
  download,
  onClick,
  className = '',
  ariaLabel,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const fine = useFinePointer()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 })

  const onMove = (e: React.PointerEvent) => {
    if (!fine || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      aria-label={ariaLabel}
      download={download || undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[15px] font-medium tracking-tight transition-[background-position,box-shadow,border-color,background-color] duration-500 ${styles[variant]} ${className}`}
    >
      {children}
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
    </motion.a>
  )
}
