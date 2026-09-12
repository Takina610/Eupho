import { useEffect, type RefObject } from 'react'

/**
 * The wall-push (see the .wipe-push rules in app.css) shoves an element only
 * once the seam line reaches its edge, so every .wipe-push element publishes
 * its edges in vw as custom properties: `--push-at` (right edge, contact on
 * forward wipes) and `--push-from` (left edge, backward wipes).
 *
 * Elements containing an image that fills them (transparent character art)
 * place their contact edges at the visible silhouette, precomputed per
 * character as width fractions (`imageSpan`, see `pushEdge` in
 * constants/characters.ts) and mapped through the `object-fit: contain`
 * drawn rect — the element box is the base on purpose, because entrance
 * animations (cp-drift) temporarily translate the img while its resting
 * layout position is the stable reference. Elements without a filling image
 * use their box edges. Measured on mount, resize, element size changes,
 * section arrival, and — with live rects — once at wipe start, so a figure
 * that is mid-drift is contacted exactly where it is drawn. All writes are
 * synchronous: no scanning, no awaiting, nothing to jank the wipe.
 */
export function useWallPushOffsets(
  ref: RefObject<HTMLElement | null>,
  imageSpan: readonly [number, number] | null,
) {
  useEffect(() => {
    const root = ref.current
    if (!root) {
      return
    }

    const elements = () => root.querySelectorAll<HTMLElement>('.wipe-push')

    const writeElement = (el: HTMLElement, live: boolean) => {
      const vw = window.innerWidth || 1
      const rect = el.getBoundingClientRect()
      let contactRight = rect.right
      let contactLeft = rect.left
      // Only the element's own artwork qualifies: an img that fills the
      // element. Nested imgs (e.g. thumbnails inside the copy block) are
      // children, not the pushed surface.
      const img = el.querySelector('img')
      const imgRect = img?.getBoundingClientRect()
      const fillsElement =
        img && imgRect &&
        imgRect.width >= rect.width * 0.9 &&
        imgRect.height >= rect.height * 0.9
      if (img && imgRect && fillsElement && imageSpan && img.naturalWidth > 0) {
        const scale = Math.min(imgRect.width / img.naturalWidth, imgRect.height / img.naturalHeight) || 0
        const drawnWidth = img.naturalWidth * scale
        const offsetX = (imgRect.width - drawnWidth) / 2
        // `live` keeps the img rect as-is: a figure mid-entrance-drift sits
        // left of its resting spot, and the wall must contact it there.
        const base = live ? imgRect.left : rect.left
        contactRight = base + offsetX + drawnWidth * imageSpan[1]
        contactLeft = base + offsetX + drawnWidth * imageSpan[0]
      }
      el.style.setProperty('--push-at', (Math.min(contactRight / vw, 1) * 100).toFixed(3))
      el.style.setProperty('--push-from', (Math.max(contactLeft / vw, 0) * 100).toFixed(3))
    }

    const write = (live = false) => {
      for (const el of elements()) {
        writeElement(el, live)
      }
    }

    // Wipe start: re-measure with live rects so a figure that is mid-drift is
    // contacted exactly where it is drawn. Arrival at the section re-measures
    // before any leaving can start.
    const layer = root.closest('[data-active]')
    const layerObserver = layer
      ? new MutationObserver(() => {
          const leaving = layer.getAttribute('data-leaving')
          if (leaving === 'forward' || leaving === 'backward') {
            write(true)
            return
          }
          if (layer.getAttribute('data-active') === 'true') {
            write()
          }
        })
      : null
    if (layer) {
      layerObserver?.observe(layer, { attributes: true, attributeFilter: ['data-active', 'data-leaving'] })
    }

    write()
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => write()))
    const onResize = () => write()
    const observer = new ResizeObserver(() => write())
    observer.observe(root)
    for (const el of elements()) {
      observer.observe(el)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      layerObserver?.disconnect()
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [ref, imageSpan])
}
