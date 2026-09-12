import { useEffect, type RefObject } from 'react'

/**
 * The wall-push (see the .wipe-push rules in app.css) shoves an element only
 * once the seam line reaches its edge, so every .wipe-push element publishes
 * its edges in vw as custom properties: `--push-at` (right edge, contact on
 * forward wipes) and `--push-from` (left edge, backward wipes). Edges are
 * clamped into the viewport so contact never precedes the wipe, and are
 * re-measured on layout changes while the section is not mid-wipe (during a
 * wipe the rects are translated and would poison the offsets).
 */
export function useWallPushOffsets(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) {
      return
    }

    const elements = () => root.querySelectorAll<HTMLElement>('.wipe-push')

    const write = () => {
      const leaving = root.closest('[data-active]')?.getAttribute('data-leaving')
      if (leaving && leaving !== 'false') {
        return
      }
      const vw = window.innerWidth || 1
      for (const el of elements()) {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--push-at', (Math.min(rect.right / vw, 1) * 100).toFixed(3))
        el.style.setProperty('--push-from', (Math.max(rect.left / vw, 0) * 100).toFixed(3))
      }
    }

    write()
    const observer = new ResizeObserver(write)
    observer.observe(root)
    for (const el of elements()) {
      observer.observe(el)
    }
    return () => {
      observer.disconnect()
    }
  }, [ref])
}
