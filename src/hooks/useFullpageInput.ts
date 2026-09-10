import { useEffect, useRef, type RefObject } from 'react'

const WHEEL_THRESHOLD = 24
const SWIPE_THRESHOLD = 48

type UseFullpageInputOptions = {
  lockedRef: RefObject<boolean>
  onStep: (delta: 1 | -1) => void
  onGoTo: (index: number) => void
  pageCount: number
  targetRef: RefObject<HTMLElement | null>
}

export function useFullpageInput({
  lockedRef,
  onStep,
  onGoTo,
  pageCount,
  targetRef,
}: UseFullpageInputOptions) {
  const onStepRef = useRef(onStep)
  const onGoToRef = useRef(onGoTo)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  onStepRef.current = onStep
  onGoToRef.current = onGoTo

  useEffect(() => {
    const surface: EventTarget = targetRef.current ?? window

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      const delta = absX > absY ? event.deltaX : event.deltaY
      if (lockedRef.current || Math.abs(delta) < WHEEL_THRESHOLD) {
        return
      }

      onStepRef.current(delta > 0 ? 1 : -1)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      if (lockedRef.current) {
        if (['ArrowRight', 'ArrowDown', 'PageDown', 'ArrowLeft', 'ArrowUp', 'PageUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault()
        }
        return
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault()
          onStepRef.current(1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault()
          onStepRef.current(-1)
          break
        case 'Home':
          event.preventDefault()
          onGoToRef.current(0)
          break
        case 'End':
          event.preventDefault()
          onGoToRef.current(pageCount - 1)
          break
        default:
          break
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null
    }

    const onTouchMove = (event: TouchEvent) => {
      if (touchStart.current) {
        event.preventDefault()
      }
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStart.current == null) {
        return
      }

      const end = event.changedTouches[0]
      const start = touchStart.current
      touchStart.current = null
      if (!end || lockedRef.current) {
        return
      }

      const deltaX = start.x - end.clientX
      const deltaY = start.y - end.clientY
      const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY
      if (Math.abs(delta) < SWIPE_THRESHOLD) {
        return
      }

      onStepRef.current(delta > 0 ? 1 : -1)
    }

    surface.addEventListener('wheel', onWheel as EventListener, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    surface.addEventListener('touchstart', onTouchStart as EventListener, { passive: true })
    surface.addEventListener('touchmove', onTouchMove as EventListener, { passive: false })
    surface.addEventListener('touchend', onTouchEnd as EventListener, { passive: true })

    return () => {
      surface.removeEventListener('wheel', onWheel as EventListener)
      window.removeEventListener('keydown', onKeyDown)
      surface.removeEventListener('touchstart', onTouchStart as EventListener)
      surface.removeEventListener('touchmove', onTouchMove as EventListener)
      surface.removeEventListener('touchend', onTouchEnd as EventListener)
    }
  }, [lockedRef, pageCount, targetRef])
}
