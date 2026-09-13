import { useLayoutEffect, useRef, type RefObject } from 'react'
import { lowerClipPathAt, seamProgressAt, upperClipPathAt } from '@/lib/seamWipe'

type LayerRefs = RefObject<Map<number, HTMLDivElement | null>>

type UseSeamTransitionOptions = {
  from: number
  to: number
  durationMs: number
  reducedMotion: boolean
  /** Scene layer elements by section index, registered by FullpageScenes. */
  layerRefs: LayerRefs
  onComplete: () => void
}

type WallPush = {
  el: HTMLElement
  /** Contact edges in vw units, published by useWallPushOffsets. */
  at: number
  from: number
}

/**
 * Drive the seam wipe outside React: a rAF loop writes clip-path directly onto the
 * two animating layer elements and translate directly onto the leaving layer's
 * `.wipe-push` elements. Writing an inherited custom property on a shared ancestor
 * instead would invalidate the whole scenes subtree every frame, so the per-frame
 * writes stay scoped to the few elements that actually move. No per-frame state
 * updates happen; React only re-renders when the from/to pair changes and once more
 * when the wipe completes.
 */
export function useSeamTransition({
  from,
  to,
  durationMs,
  reducedMotion,
  layerRefs,
  onComplete,
}: UseSeamTransitionOptions) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useLayoutEffect(() => {
    const layers = layerRefs.current
    const lowerEl = layers.get(Math.min(from, to)) ?? null
    const upperEl = layers.get(Math.max(from, to)) ?? null

    if (reducedMotion && from !== to) {
      // Completion value of the seam: direction-aware (1 = lower fully visible, 0 =
      // upper fully visible). Writing it before onComplete keeps any frame rendered
      // before React commits the idle styles identical to the final state.
      const completionP = seamProgressAt(1, from, to)
      if (lowerEl) lowerEl.style.clipPath = lowerClipPathAt(completionP)
      if (upperEl) upperEl.style.clipPath = upperClipPathAt(completionP)
      onCompleteRef.current()
      return
    }

    if (from === to || !lowerEl || !upperEl) {
      return
    }

    const forward = to > from
    // Direction-aware completion value (1 = lower fully visible, 0 = upper fully visible).
    const completionP = seamProgressAt(1, from, to)

    const applyProgress = (p: number) => {
      lowerEl.style.clipPath = lowerClipPathAt(p)
      upperEl.style.clipPath = upperClipPathAt(p)
    }

    // The leaving layer's wall-push elements ride the seam once it reaches their
    // edge (see .wipe-push in app.css). Collected on the first tick so
    // useWallPushOffsets' live re-measure (same-flip MutationObserver) lands first.
    let pushes: WallPush[] | null = null
    const setupPushes = () => {
      const leavingEl = layers.get(from)
      const collected: WallPush[] = []
      if (leavingEl) {
        for (const el of leavingEl.querySelectorAll<HTMLElement>('.wipe-push')) {
          const at = parseFloat(el.style.getPropertyValue('--push-at'))
          const fromEdge = parseFloat(el.style.getPropertyValue('--push-from'))
          collected.push({
            el,
            at: Number.isFinite(at) ? at : 100,
            from: Number.isFinite(fromEdge) ? fromEdge : 0,
          })
          el.style.willChange = 'translate'
        }
      }
      pushes = collected
    }

    const applyPushes = (p: number) => {
      if (!pushes) {
        return
      }
      const vw = window.innerWidth || 1
      for (const { el, at, from: fromEdge } of pushes) {
        const x = forward
          ? Math.min(0, p * vw - (at * vw) / 100)
          : Math.max(0, p * vw - (fromEdge * vw) / 100)
        el.style.translate = `${x}px 0`
      }
    }

    const clearPushes = () => {
      if (!pushes) {
        return
      }
      for (const { el } of pushes) {
        el.style.willChange = ''
        el.style.translate = ''
      }
      pushes = null
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
      applyProgress(completionP)
      clearPushes()
      onCompleteRef.current()
    }

    const tick = (now: number) => {
      if (cancelled) {
        return
      }

      if (pushes == null) {
        setupPushes()
      }
      const rawT = Math.min(1, (now - start) / durationMs)
      const p = seamProgressAt(rawT, from, to)
      applyProgress(p)
      applyPushes(p)
      if (rawT < 1) {
        raf = requestAnimationFrame(tick)
        return
      }

      finish()
    }

    // Seed the start progress before the first paint so the wipe never flashes its end state.
    applyProgress(seamProgressAt(0, from, to))
    raf = requestAnimationFrame(tick)
    watchdog = window.setTimeout(finish, durationMs + 48)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(watchdog)
      clearPushes()
    }
  }, [from, to, durationMs, reducedMotion, layerRefs])

  return {
    isAnimating: from !== to && !reducedMotion,
  }
}
