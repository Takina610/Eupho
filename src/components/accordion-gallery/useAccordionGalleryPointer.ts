import { useEffect, useRef, type FocusEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

export function useAccordionGalleryPointer({
  active,
  setActive,
  recessed,
  hoverExpand,
  duration,
  onOpenActive,
}: {
  active: number
  setActive: (index: number) => void
  recessed: boolean
  hoverExpand: boolean
  duration: number
  onOpenActive?: (index: number) => void
}) {
  const openArmedRef = useRef(false)
  const pendingOpenRef = useRef<number | null>(null)
  const openTimerRef = useRef(0)

  const openActive = (index: number) => {
    onOpenActive?.(index)
  }

  const clearPendingOpen = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = 0
    }
    pendingOpenRef.current = null
  }

  useEffect(() => () => clearPendingOpen(), [])

  useEffect(() => {
    if (recessed) {
      clearPendingOpen()
    }
  }, [recessed])

  const scheduleOpen = (index: number) => {
    clearPendingOpen()
    const wait = prefersReducedMotion() ? 0 : duration * 1000
    pendingOpenRef.current = index
    openTimerRef.current = window.setTimeout(() => {
      openTimerRef.current = 0
      if (pendingOpenRef.current !== index) {
        return
      }
      pendingOpenRef.current = null
      openActive(index)
    }, wait)
  }

  const handleEnter = (index: number) => {
    if (recessed || !hoverExpand) {
      return
    }
    setActive(index)
  }

  const handlePointerDown = (index: number) => {
    openArmedRef.current = index === active
  }

  const handleClick = (index: number, event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (recessed) {
      return
    }

    if (hoverExpand) {
      const canOpen = openArmedRef.current
      openArmedRef.current = false
      if (!canOpen) {
        setActive(index)
        return
      }
      openActive(index)
      return
    }

    if (pendingOpenRef.current === index) {
      return
    }
    if (index !== active) {
      setActive(index)
      scheduleOpen(index)
      return
    }
    openActive(index)
  }

  const handleFocus = (index: number, event: FocusEvent<HTMLElement>) => {
    if (recessed) {
      return
    }
    if (hoverExpand || event.currentTarget.matches(':focus-visible')) {
      setActive(index)
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLElement>) => {
    if (recessed) {
      return
    }
    if ((event.key === 'Enter' || event.key === ' ') && index === active) {
      event.preventDefault()
      clearPendingOpen()
      openActive(index)
    }
  }

  return { handleEnter, handlePointerDown, handleClick, handleFocus, handleKeyDown }
}
