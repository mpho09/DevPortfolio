import { useEffect, useState } from 'react'

/** Returns the id of the section currently occupying the middle of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => observer.observe(el))

    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [ids])

  return active
}
