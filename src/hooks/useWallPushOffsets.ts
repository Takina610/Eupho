import { useEffect, type RefObject } from 'react'
import { imageVisualSpan } from '@/lib/alphaEdge'

/**
 * The wall-push (see the .wipe-push rules in app.css) shoves an element only
 * once the seam line reaches its edge, so every .wipe-push element publishes
 * its edges in vw as custom properties: `--push-at` (right edge, contact on
 * forward wipes) and `--push-from` (left edge, backward wipes).
 *
 * Elements containing an image (transparent character art) report the visible
 * silhouette edge instead of the image box edge — the art is square with
 * transparent padding, so the box edge would make the wall push air. The
 * drawn-image rect is derived from `object-fit: contain` with
 * `object-position: center bottom` (the layout the character stage uses).
 *
 * Re-measured on resize, on element/image size changes, and whenever the
 * section becomes active: stylesheets (dev) and art load after mount, so the
 * mount-time layout must not be the last word — and re-measuring on arrival
 * guarantees the edges are current before any wipe can leave the section.
 */
export function useWallPushOffsets(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) {
      return
    }

    const elements = () => root.querySelectorAll<HTMLElement>('.wipe-push')

    const midWipe = () => {
      const leaving = root.closest('[data-active]')?.getAttribute('data-leaving')
      return Boolean(leaving && leaving !== 'false')
    }

    const writeElement = async (el: HTMLElement) => {
      const vw = window.innerWidth || 1
      const rect = el.getBoundingClientRect()
      let contactRight = rect.right
      let contactLeft = rect.left
      // Only the element's own artwork qualifies: an img that fills the
      // element. Nested imgs (e.g. thumbnails inside the copy block) are
      // children, not the pushed surface.
      const img = el.querySelector('img')
      if (img) {
        const imgRect = img.getBoundingClientRect()
        const fillsElement =
          imgRect.width >= rect.width * 0.9 && imgRect.height >= rect.height * 0.9
        if (!fillsElement || !img.complete || img.naturalWidth === 0) {
          if (!fillsElement) {
            // keep box edges; nothing to re-measure on load either
            el.style.setProperty('--push-at', (Math.min(contactRight / vw, 1) * 100).toFixed(3))
            el.style.setProperty('--push-from', (Math.max(contactLeft / vw, 0) * 100).toFixed(3))
          }
          return // the capture-phase load listener re-runs this once decoded
        }
        const span = await imageVisualSpan(img)
        if (!span || midWipe()) {
          return
        }
        // object-fit: contain, object-position: center bottom → the drawn rect
        // hugs the element box width or height, centered horizontally, pinned
        // to bottom. The element box (not the img rect) is the base on purpose:
        // entrance animations (cp-drift) temporarily translate the img while
        // its resting layout position is what the wall should contact.
        const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight) || 0
        const drawnWidth = img.naturalWidth * scale
        const offsetX = (rect.width - drawnWidth) / 2
        contactRight = rect.left + offsetX + drawnWidth * span.right
        contactLeft = rect.left + offsetX + drawnWidth * span.left
      }
      el.style.setProperty('--push-at', (Math.min(contactRight / vw, 1) * 100).toFixed(3))
      el.style.setProperty('--push-from', (Math.max(contactLeft / vw, 0) * 100).toFixed(3))
    }

    const write = () => {
      if (midWipe()) {
        return
      }
      for (const el of elements()) {
        void writeElement(el)
      }
    }

    // Character swaps replace the <img> inside the (unchanged) push element;
    // load events don't bubble, so capture them at the root instead.
    const onLoad = (event: Event) => {
      const target = event.target
      if (target instanceof HTMLElement) {
        const el = target.closest<HTMLElement>('.wipe-push')
        if (el) {
          void writeElement(el)
        }
      }
    }

    // Arrival at the section re-measures before any leaving can start; the
    // double rAF lets late-applying stylesheets (dev) settle after mount.
    const layer = root.closest('[data-active]')
    const onLayerChange = () => {
      if (layer?.getAttribute('data-active') === 'true') {
        write()
      }
    }
    const layerObserver = layer
      ? new MutationObserver(onLayerChange)
      : null
    if (layer) {
      layerObserver?.observe(layer, { attributes: true, attributeFilter: ['data-active', 'data-leaving'] })
    }

    write()
    const raf = requestAnimationFrame(() => requestAnimationFrame(write))
    const observer = new ResizeObserver(write)
    observer.observe(root)
    for (const el of elements()) {
      observer.observe(el)
    }
    window.addEventListener('resize', write)
    root.addEventListener('load', onLoad, true)
    return () => {
      cancelAnimationFrame(raf)
      layerObserver?.disconnect()
      observer.disconnect()
      window.removeEventListener('resize', write)
      root.removeEventListener('load', onLoad, true)
    }
  }, [ref])
}
