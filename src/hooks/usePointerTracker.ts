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

    // Cache the target rect: reading getBoundingClientRect on every pointermove can
    // force a synchronous layout while frame animations are writing styles.
    let rect: DOMRect | null = null
    const invalidate = () => {
      rect = null
    }
    const ensureRect = () => {
      const target = targetRef.current
      if (!target) return null
      rect ??= target.getBoundingClientRect()
      return rect
    }
    window.addEventListener('resize', invalidate)

    const update = (clientX: number, clientY: number) => {
      const cached = ensureRect()
      if (!cached) return
      state.x = clientX - cached.left - cached.width / 2
      state.y = cached.height / 2 - (clientY - cached.top)
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
      window.removeEventListener('resize', invalidate)
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
