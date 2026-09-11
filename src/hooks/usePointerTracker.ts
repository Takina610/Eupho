import { useEffect, useRef, type RefObject } from 'react'

import type { PointerState } from '@/lib/particleField'

/**
 * Track the pointer in center-origin, y-up CSS pixel coordinates relative to a target
 * element (canvas-like coordinates for the particle field). Mouse and touch both work;
 * touch releases reset to inactive like the reference implementation.
 */
export function usePointerTracker(targetRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false })

  useEffect(() => {
    const state = pointer.current
    if (!enabled) {
      state.active = false
      return
    }

    const update = (clientX: number, clientY: number) => {
      const target = targetRef.current
      if (!target) return
      const rect = target.getBoundingClientRect()
      state.x = clientX - rect.left - rect.width / 2
      state.y = rect.height / 2 - (clientY - rect.top)
      state.active = true
    }

    const onPointerMove = (event: PointerEvent) => update(event.clientX, event.clientY)
    const onPointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget === null) pointer.current.active = false
    }
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) update(touch.clientX, touch.clientY)
    }
    const onTouchEnd = () => {
      pointer.current.active = false
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerLeave, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('blur', onTouchEnd)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerLeave)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('blur', onTouchEnd)
      state.active = false
    }
  }, [enabled, targetRef])

  return pointer
}
