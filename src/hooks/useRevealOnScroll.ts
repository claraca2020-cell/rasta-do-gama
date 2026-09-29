import { useEffect, useRef } from 'react'

export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => el.classList.add('is-visible')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)

    const fallback = setTimeout(reveal, 2000)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return ref
}
