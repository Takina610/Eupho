import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { FOOTER_MS, WIPE_MS } from '@/constants/fullpageMotion'
import { useFullpageHash, getIndexFromHash, pushSectionHash, type GoToOptions } from '@/hooks/useFullpageHash'
import { useFullpageInput } from '@/hooks/useFullpageInput'
import { useSeamTransition } from '@/hooks/useSeamTransition'
import { resolveFullpageIntent } from '@/lib/fullpageStep'
import { prefersReducedMotion, subscribePrefersReducedMotion } from '@/lib/motion'

export function useFullpagePager({
  pageCount,
  targetRef,
}: {
  pageCount: number
  targetRef: RefObject<HTMLElement | null>
}) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeIndex, setActiveIndex] = useState(getIndexFromHash)
  const [from, setFrom] = useState(activeIndex)
  const [to, setTo] = useState(activeIndex)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [footerRevealed, setFooterRevealed] = useState(false)
  const [footerLock, setFooterLock] = useState(false)

  const activeIndexRef = useRef(activeIndex)
  const footerRevealedRef = useRef(footerRevealed)
  const footerLockRef = useRef(footerLock)
  const lockedRef = useRef(false)
  const fromRef = useRef(from)
  const toRef = useRef(to)
  const reducedMotionRef = useRef(reducedMotion)
  const overlayLockRef = useRef(false)

  activeIndexRef.current = activeIndex
  footerRevealedRef.current = footerRevealed
  footerLockRef.current = footerLock
  fromRef.current = from
  toRef.current = to
  reducedMotionRef.current = reducedMotion
  lockedRef.current = from !== to || footerLock || overlayLockRef.current

  useEffect(() => subscribePrefersReducedMotion(setReducedMotion), [])

  const setOverlayLock = useCallback((locked: boolean) => {
    overlayLockRef.current = locked
    lockedRef.current = fromRef.current !== toRef.current || footerLockRef.current || locked
  }, [])

  const { progress, rawT } = useSeamTransition({
    from,
    to,
    durationMs: WIPE_MS,
    reducedMotion,
    onComplete: () => setFrom(toRef.current),
  })

  const goTo = useCallback(
    (nextIndex: number, options?: GoToOptions) => {
      if (lockedRef.current && !options?.interrupt) {
        return
      }

      const current = activeIndexRef.current
      const clamped = Math.min(Math.max(nextIndex, 0), pageCount - 1)
      if (footerRevealedRef.current) {
        setFooterRevealed(false)
        if (clamped === current) {
          setFooterLock(true)
          return
        }
        setFooterLock(false)
      }

      if (clamped === current) {
        return
      }

      lockedRef.current = true
      setDirection(clamped > current ? 1 : -1)
      setActiveIndex(clamped)
      activeIndexRef.current = clamped
      if (!options?.fromHash) {
        pushSectionHash(clamped)
      }

      if (reducedMotionRef.current || prefersReducedMotion()) {
        setFrom(clamped)
        setTo(clamped)
        return
      }

      setFrom(current)
      setTo(clamped)
    },
    [pageCount],
  )

  const step = useCallback(
    (delta: 1 | -1) => {
      if (lockedRef.current) {
        return
      }

      const intent = resolveFullpageIntent({
        current: activeIndexRef.current,
        lastIndex: pageCount - 1,
        delta,
        footerRevealed: footerRevealedRef.current,
      })

      if (intent.type === 'footer') {
        lockedRef.current = true
        setFooterRevealed(intent.revealed)
        setFooterLock(true)
        return
      }

      if (intent.type === 'page') {
        goTo(intent.index)
      }
    },
    [goTo, pageCount],
  )

  useEffect(() => {
    if (!footerLock) {
      return
    }

    const delay = reducedMotion ? 0 : FOOTER_MS
    const timer = window.setTimeout(() => setFooterLock(false), delay)
    return () => window.clearTimeout(timer)
  }, [footerLock, footerRevealed, reducedMotion])

  useFullpageInput({ lockedRef, onStep: step, onGoTo: goTo, pageCount, targetRef })
  useFullpageHash(goTo)

  return {
    activeIndex,
    direction,
    footerRevealed,
    from,
    goTo,
    isAnimating: from !== to || footerLock,
    footerLock,
    progress,
    rawT,
    reducedMotion,
    to,
    setOverlayLock,
  }
}
