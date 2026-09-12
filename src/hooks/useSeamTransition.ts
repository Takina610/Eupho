import { useLayoutEffect, useRef, type RefObject } from 'react'
import { seamProgressAt } from '@/lib/seamWipe'

type UseSeamTransitionOptions = {
  from: number
  to: number
  durationMs: number
  reducedMotion: boolean
  /** Element that receives the per-frame `--seam-p` variable (the scenes shell). */
  surfaceRef: RefObject<HTMLElement | null>
  onComplete: () => void
}

/**
 * Drive the seam wipe outside React: a rAF loop writes the eased `--seam-p` custom
 * property straight to the surface element, so no per-frame state updates (and thus no
 * full-tree re-renders) happen while the wipe plays. React only re-renders when the
 * from/to pair changes and once more when the wipe completes.
 */
export function useSeamTransition({
  from,
  to,
  durationMs,
  reducedMotion,
  surfaceRef,
  onComplete,
}: UseSeamTransitionOptions) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useLayoutEffect(() => {
    const surface = surfaceRef.current
    if (!surface) {
      return
    }

    if (from === to) {
      surface.style.setProperty('--seam-p', '1')
      return
    }

    if (reducedMotion) {
      surface.style.setProperty('--seam-p', '1')
      onCompleteRef.current()
      return
    }

    let raf = 0
    let watchdog = 0
    let cancelled = false
    const start = performance.now()

    const finish = () => {
      if (cancelled) {
        return
      }
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(watchdog)
      surface.style.setProperty('--seam-p', '1')
      onCompleteRef.current()
    }

    const tick = (now: number) => {
      if (cancelled) {
        return
      }

      const rawT = Math.min(1, (now - start) / durationMs)
      surface.style.setProperty('--seam-p', String(seamProgressAt(rawT, from, to)))
      if (rawT < 1) {
        raf = requestAnimationFrame(tick)
        return
      }

      finish()
    }

    // Seed the start progress before the first paint so the wipe never flashes its end state.
    surface.style.setProperty('--seam-p', String(seamProgressAt(0, from, to)))
    raf = requestAnimationFrame(tick)
    watchdog = window.setTimeout(finish, durationMs + 48)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(watchdog)
    }
  }, [from, to, durationMs, reducedMotion, surfaceRef])

  return {
    isAnimating: from !== to && !reducedMotion,
  }
}
