import { useEffect, useState, type RefObject } from 'react'
import { useLenis } from 'lenis/react'
import Snap from 'lenis/snap'
import { prefersReducedMotion } from '@/lib/motion'

type UseFullpageSnapOptions = {
  containerRef: RefObject<HTMLElement | null>
  sectionSelector?: string
  enabled?: boolean
}

export function useFullpageSnap({
  containerRef,
  sectionSelector = '[data-fullpage-section]',
  enabled = true,
}: UseFullpageSnapOptions) {
  const lenis = useLenis()
  const [activeIndex, setActiveIndex] = useState(0)
  const [snap, setSnap] = useState<Snap | null>(null)

  useEffect(() => {
    if (!enabled || prefersReducedMotion() || !lenis || !containerRef.current) {
      setSnap(null)
      return
    }

    const sectionEls = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(sectionSelector),
    )

    if (sectionEls.length === 0) {
      setSnap(null)
      return
    }

    const instance = new Snap(lenis, {
      type: 'lock',
      distanceThreshold: '100%',
      debounce: 0,
      duration: 1,
      onSnapComplete: (snapItem) => {
        if (typeof snapItem.index === 'number') {
          setActiveIndex(snapItem.index)
        }
      },
    })

    instance.addElements(sectionEls, { align: 'start' })
    setSnap(instance)

    return () => {
      instance.destroy()
      setSnap(null)
    }
  }, [containerRef, enabled, lenis, sectionSelector])

  useEffect(() => {
    if (!snap) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault()
          snap.next()
          break
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault()
          snap.previous()
          break
        case 'Home':
          event.preventDefault()
          snap.goTo(0)
          break
        case 'End':
          event.preventDefault()
          if (containerRef.current) {
            const count = containerRef.current.querySelectorAll(sectionSelector).length
            snap.goTo(Math.max(0, count - 1))
          }
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [containerRef, sectionSelector, snap])

  return {
    activeIndex,
    goTo: (index: number) => {
      if (snap) {
        snap.goTo(index)
        return
      }

      const sections = containerRef.current?.querySelectorAll<HTMLElement>(sectionSelector)
      const target = sections?.item(index)
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
        setActiveIndex(index)
      }
    },
    next: () => snap?.next(),
    previous: () => snap?.previous(),
  }
}
