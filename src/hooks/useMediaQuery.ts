import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** True on devices with a precise, hover-capable pointer (i.e. not touch-first). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
