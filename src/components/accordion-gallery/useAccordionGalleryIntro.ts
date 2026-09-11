import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

const INTRO_DURATION = 0.62
const INTRO_STAGGER = 0.055
const INTRO_OFFSET = -110

function introOffset(vertical: boolean) {
  return vertical
    ? { xPercent: INTRO_OFFSET, yPercent: 0 }
    : { xPercent: 0, yPercent: INTRO_OFFSET }
}

export function useAccordionGalleryIntro({
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
    gsap.set(inserts, introOffset(vertical))
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
      gsap.set(inserts, introOffset(vertical))
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
      gsap.set(inserts, introOffset(vertical))
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

    const sync = () => {
      const active = !layer || layer.getAttribute('data-active') === 'true'
      if (active) {
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
    observer.observe(layer, { attributes: true, attributeFilter: ['data-active'] })
    return () => {
      observer.disconnect()
      tlRef.current?.kill()
      enteredRef.current = false
      root.style.pointerEvents = ''
    }
  }, [count, rootRef, vertical])

  return { insertRefs }
}
