import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import {
  clamp,
  knobLayout,
  offsetFromProgressX,
  offsetToReveal,
  resistOffset,
  trackOverflow,
} from '@/lib/dragScroll'
import { prefersReducedMotion } from '@/lib/motion'

const DRAG_THRESHOLD = 5
const INERTIA_DURATION = 0.3

export function useDragScroll({
  progressRef,
  trackRef,
  viewportRef,
}: {
  progressRef: RefObject<HTMLElement | null>
  trackRef: RefObject<HTMLElement | null>
  viewportRef: RefObject<HTMLElement | null>
}) {
  const offsetRef = useRef(0)
  const draggedRef = useRef(false)
  const paintRef = useRef<(offset: number) => void>(() => undefined)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const consumeDrag = useCallback(() => {
    if (!draggedRef.current) {
      return false
    }
    draggedRef.current = false
    return true
  }, [])

  const ensureVisible = useCallback((index: number) => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) {
      return
    }

    const next = offsetToReveal(track, viewport, index, offsetRef.current)
    if (next == null) {
      return
    }

    tweenRef.current?.kill()
    const proxy = { x: offsetRef.current }
    tweenRef.current = gsap.to(proxy, {
      x: next,
      duration: prefersReducedMotion() ? 0 : INERTIA_DURATION,
      ease: 'power2.out',
      onUpdate: () => paintRef.current(proxy.x),
    })
  }, [trackRef, viewportRef])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const progress = progressRef.current
    if (!viewport || !track) {
      return
    }

    const paint = (offset: number) => {
      offsetRef.current = offset
      gsap.set(track, { x: -offset, force3D: true })
      if (!progress) {
        return
      }
      const { knobWidth, max, travel } = knobLayout(track, viewport, progress)
      const knob = progress.firstElementChild
      if (knob instanceof HTMLElement) {
        gsap.set(knob, { width: knobWidth, x: max > 0 ? (clamp(offset, 0, max) / max) * travel : 0 })
      }
    }

    paintRef.current = paint
    paint(offsetRef.current)

    let mode: 'track' | 'progress' | null = null
    let axis: 'x' | 'y' | null = null
    let startX = 0
    let startY = 0
    let origin = 0
    let lastT = 0
    let lastX = 0
    let velocity = 0

    const unbind = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    const bind = () => {
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    }

    const onMove = (event: PointerEvent) => {
      if (mode === 'progress' && progress) {
        const { knobWidth, max, travel } = knobLayout(track, viewport, progress)
        paint(offsetFromProgressX(event.clientX, progress, knobWidth, travel, max))
        return
      }
      if (mode !== 'track') {
        return
      }

      const dx = event.clientX - startX
      const dy = event.clientY - startY
      if (!axis) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) {
          return
        }
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
        draggedRef.current = true
        if (axis === 'y') {
          finish()
          return
        }
      }
      if (axis !== 'x') {
        return
      }

      const dt = event.timeStamp - lastT
      if (dt >= 8) {
        velocity = clamp(((event.clientX - lastX) / dt) * -1000, -4500, 4500)
      }
      lastT = event.timeStamp
      lastX = event.clientX
      paint(resistOffset(origin - dx, trackOverflow(track, viewport)))
    }

    const finish = () => {
      mode = null
      axis = null
      unbind()
      window.setTimeout(() => {
        draggedRef.current = false
      }, 0)
    }

    const onUp = () => {
      if (mode === 'track' && axis === 'x') {
        const current = offsetRef.current
        const max = trackOverflow(track, viewport)
        const target = current < 0 || current > max
          ? clamp(current, 0, max)
          : clamp(current + velocity * INERTIA_DURATION, 0, max)
        const proxy = { x: current }
        tweenRef.current?.kill()
        tweenRef.current = gsap.to(proxy, {
          x: target,
          duration: prefersReducedMotion() ? 0 : INERTIA_DURATION,
          ease: 'power2.out',
          onUpdate: () => paint(proxy.x),
        })
      }
      finish()
    }

    const onTrackDown = (event: PointerEvent) => {
      if (event.button !== 0 || progress?.contains(event.target as Node)) {
        return
      }
      tweenRef.current?.kill()
      mode = 'track'
      axis = null
      startX = event.clientX
      startY = event.clientY
      origin = offsetRef.current
      lastT = event.timeStamp
      lastX = event.clientX
      velocity = 0
      bind()
    }

    const onProgressDown = (event: PointerEvent) => {
      if (event.button !== 0 || !progress) {
        return
      }
      tweenRef.current?.kill()
      mode = 'progress'
      bind()
      const { knobWidth, max, travel } = knobLayout(track, viewport, progress)
      paint(offsetFromProgressX(event.clientX, progress, knobWidth, travel, max))
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!draggedRef.current) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      draggedRef.current = false
    }

    const onResize = () => paint(clamp(offsetRef.current, 0, trackOverflow(track, viewport)))
    const observer = new ResizeObserver(onResize)
    observer.observe(viewport)
    observer.observe(track)
    viewport.addEventListener('pointerdown', onTrackDown)
    viewport.addEventListener('click', onClickCapture, true)
    progress?.addEventListener('pointerdown', onProgressDown)

    return () => {
      tweenRef.current?.kill()
      unbind()
      observer.disconnect()
      viewport.removeEventListener('pointerdown', onTrackDown)
      viewport.removeEventListener('click', onClickCapture, true)
      progress?.removeEventListener('pointerdown', onProgressDown)
    }
  }, [progressRef, trackRef, viewportRef])

  return { consumeDrag, ensureVisible }
}
