import { useRef } from 'react'

export function useSwipeNavigation(onSwipe: (direction: 1 | -1) => void) {
  const startX = useRef<number | null>(null)

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    startX.current = event.clientX
  }

  const finishSwipe = (event: React.PointerEvent<HTMLElement>) => {
    if (startX.current === null) return

    const distance = event.clientX - startX.current
    startX.current = null

    if (Math.abs(distance) >= 45) {
      onSwipe(distance < 0 ? 1 : -1)
    }
  }

  return {
    onPointerDown,
    onPointerUp: finishSwipe,
    onPointerCancel: () => {
      startX.current = null
    },
    style: { touchAction: 'pan-y' as const },
  }
}
