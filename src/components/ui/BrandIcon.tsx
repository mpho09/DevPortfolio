import type { SimpleIcon } from 'simple-icons'

interface BrandIconProps {
  icon: SimpleIcon
  className?: string
  color?: string
}

export function BrandIcon({ icon, className = 'size-6', color = 'currentColor' }: BrandIconProps) {
  return (
    <svg role="img" aria-hidden viewBox="0 0 24 24" className={className} fill={color}>
      <path d={icon.path} />
    </svg>
  )
}
