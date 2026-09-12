import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

const INTRO_DURATION = 0.62
const INTRO_STAGGER = 0.055
const INTRO_OFFSET = -110

// Exit plays inside the seam wipe (WIPE_MS = 1000ms): panels retract back to the
// intro offset, right to left, lifted clear before the wipe erases each one.
const EXIT_DURATION = 0.5
const EXIT_STAGGER = 0.06
const EXIT_EASE = 'power2.out'

function transitionOffset(vertical: boolean) {
  return vertical
    ? { xPercent: INTRO_OFFSET, yPercent: 0 }
    : { xPercent: 0, yPercent: INTRO_OFFSET }
}

export function useAccordionGalleryTransition({
  rootRef,
  vertical,
  count,
}: {
  rootRef: RefObject<HTMLDivElement | null>
  vertical: boolean
  count: number
}) {
  const insertRefs = useRef<(HTMLElement | null)[]>([])
  const enteredRef = useRef(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const liveInserts = () => insertRefs.current.filter((node): node is HTMLElement => node != null)

  useLayoutEffect(() => {
    if (enteredRef.current || prefersReducedMotion()) {
      return
    }
    const inserts = liveInserts()
    if (inserts.length !== count) {
      return
    }
    gsap.set(inserts, transitionOffset(vertical))
  }, [count, vertical])

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return
    }

    const layer = root.closest('[data-active]')

    const park = () => {
      tlRef.current?.kill()
      tlRef.current = null
      enteredRef.current = false
      root.style.pointerEvents = ''
      const inserts = liveInserts()
      if (!inserts.length) {
        return
      }
      if (prefersReducedMotion()) {
        gsap.set(inserts, { xPercent: 0, yPercent: 0 })
        return
      }
      gsap.set(inserts, transitionOffset(vertical))
    }

    const play = () => {
      const inserts = liveInserts()
      if (!inserts.length || enteredRef.current) {
        return
      }
      enteredRef.current = true
      tlRef.current?.kill()

      if (prefersReducedMotion()) {
        gsap.set(inserts, { xPercent: 0, yPercent: 0 })
        return
      }

      root.style.pointerEvents = 'none'
      gsap.set(inserts, transitionOffset(vertical))
      tlRef.current = gsap.timeline({
        onComplete: () => {
          root.style.pointerEvents = ''
        },
      })
      tlRef.current.to(inserts, {
        xPercent: 0,
        yPercent: 0,
        duration: INTRO_DURATION,
        ease: 'power3.out',
        stagger: INTRO_STAGGER,
      })
    }

    const exit = () => {
      const inserts = liveInserts()
      if (!inserts.length) {
        return
      }
      tlRef.current?.kill()
      tlRef.current = null
      enteredRef.current = false
      root.style.pointerEvents = ''

      if (prefersReducedMotion()) {
        gsap.set(inserts, transitionOffset(vertical))
        return
      }

      tlRef.current = gsap.timeline()
      tlRef.current.to(inserts, {
        ...transitionOffset(vertical),
        duration: EXIT_DURATION,
        ease: EXIT_EASE,
        stagger: { each: EXIT_STAGGER, from: 'end' },
      })
    }

    const sync = () => {
      if (!layer) {
        return
      }
      const leaving = layer.getAttribute('data-leaving')
      if (leaving === 'forward' || leaving === 'backward') {
        exit()
        return
      }
      if (layer.getAttribute('data-active') === 'true') {
        play()
      } else {
        park()
      }
    }

    sync()

    if (!layer) {
      return () => {
        tlRef.current?.kill()
        enteredRef.current = false
        root.style.pointerEvents = ''
      }
    }

    const observer = new MutationObserver(sync)
    observer.observe(layer, { attributes: true, attributeFilter: ['data-active', 'data-leaving'] })
    return () => {
      observer.disconnect()
      tlRef.current?.kill()
      enteredRef.current = false
      root.style.pointerEvents = ''
    }
  }, [count, rootRef, vertical])

  return { insertRefs }
}
