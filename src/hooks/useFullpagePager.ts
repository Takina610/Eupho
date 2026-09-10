import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, subscribePrefersReducedMotion } from '@/lib/motion'

const TRANSITION_MS = 700
const WHEEL_THRESHOLD = 24
const SWIPE_THRESHOLD = 48

type UseFullpagePagerOptions = {
  pageCount: number
}

export function useFullpagePager({ pageCount }: UseFullpagePagerOptions) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [settled, setSettled] = useState(true)

  const activeIndexRef = useRef(activeIndex)
  const isAnimatingRef = useRef(isAnimating)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  activeIndexRef.current = activeIndex
  isAnimatingRef.current = isAnimating

  useEffect(() => subscribePrefersReducedMotion(setReducedMotion), [])

  const goTo = useCallback(
    (nextIndex: number) => {
      if (isAnimatingRef.current) {
        return
      }

      const current = activeIndexRef.current
      const clamped = Math.min(Math.max(nextIndex, 0), pageCount - 1)
      if (clamped === current) {
        return
      }

      if (reducedMotion || prefersReducedMotion()) {
        setActiveIndex(clamped)
        setLeavingIndex(null)
        setIsAnimating(false)
        setSettled(true)
        return
      }

      const nextDirection: 1 | -1 = clamped > current ? 1 : -1
      setDirection(nextDirection)
      setLeavingIndex(current)
      setActiveIndex(clamped)
      setSettled(false)
      setIsAnimating(true)
    },
    [pageCount, reducedMotion],
  )

  useEffect(() => {
    if (settled || !isAnimating) {
      return
    }

    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSettled(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [isAnimating, settled])

  useEffect(() => {
    if (!isAnimating) {
      return
    }

    const delay = reducedMotion ? 0 : TRANSITION_MS
    const timer = window.setTimeout(() => {
      setIsAnimating(false)
      setLeavingIndex(null)
      setSettled(true)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [isAnimating, activeIndex, reducedMotion])

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      const delta = absX > absY ? event.deltaX : event.deltaY
      if (isAnimatingRef.current || Math.abs(delta) < WHEEL_THRESHOLD) {
        return
      }

      goTo(activeIndexRef.current + (delta > 0 ? 1 : -1))
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault()
          goTo(activeIndexRef.current + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault()
          goTo(activeIndexRef.current - 1)
          break
        case 'Home':
          event.preventDefault()
          goTo(0)
          break
        case 'End':
          event.preventDefault()
          goTo(pageCount - 1)
          break
        default:
          break
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStart.current == null) {
        return
      }

      const end = event.changedTouches[0]
      if (!end) {
        touchStart.current = null
        return
      }

      const deltaX = touchStart.current.x - end.clientX
      const deltaY = touchStart.current.y - end.clientY
      touchStart.current = null
      const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY
      if (Math.abs(delta) < SWIPE_THRESHOLD) {
        return
      }

      goTo(activeIndexRef.current + (delta > 0 ? 1 : -1))
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goTo, pageCount])

  return {
    activeIndex,
    direction,
    goTo,
    isAnimating,
    leavingIndex,
    settled,
    transitionMs: reducedMotion ? 0 : TRANSITION_MS,
  }
}
