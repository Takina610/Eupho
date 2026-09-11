import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

type ElRef = RefObject<HTMLElement | null>

export function useSeriesDetailTimeline({
  stageRef,
  scrimRef,
  onExited,
}: {
  stageRef: ElRef
  scrimRef: ElRef
  onExited: () => void
}) {
  const closingRef = useRef(false)
  const readyRef = useRef(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const scrim = scrimRef.current
    if (!stage) {
      return
    }

    closingRef.current = false
    readyRef.current = false
    tlRef.current?.kill()
    gsap.killTweensOf([stage, scrim])
    gsap.set(stage, { x: 0, xPercent: 100 })
    gsap.set(scrim, { opacity: 0 })

    if (prefersReducedMotion()) {
      gsap.set(stage, { x: 0, xPercent: 0 })
      gsap.set(scrim, { opacity: 1 })
      readyRef.current = true
      return
    }

    const tl = gsap.timeline()
    tl.to(stage, { x: 0, xPercent: 0, duration: 0.55, ease: 'power3.out' }, 0)
    tl.to(scrim, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
    tl.call(
      () => {
        readyRef.current = true
      },
      undefined,
      0.35,
    )
    tlRef.current = tl

    return () => {
      tl.kill()
    }
  }, [scrimRef, stageRef])

  const close = useCallback(() => {
    if (closingRef.current || !readyRef.current) {
      return
    }
    closingRef.current = true

    const stage = stageRef.current
    const scrim = scrimRef.current

    if (!stage || prefersReducedMotion()) {
      onExited()
      return
    }

    tlRef.current?.kill()
    tlRef.current = gsap.timeline({ onComplete: onExited })
    tlRef.current.to(stage, { x: 0, xPercent: 100, duration: 0.45, ease: 'power3.in' }, 0)
    tlRef.current.to(scrim, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
  }, [onExited, scrimRef, stageRef])

  return { close }
}
