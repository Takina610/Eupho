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
  layerRefs,
}: {
  pageCount: number
  targetRef: RefObject<HTMLElement | null>
  layerRefs: RefObject<Map<number, HTMLDivElement | null>>
}) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeIndex, setActiveIndex] = useState(getIndexFromHash)
  const [from, setFrom] = useState(activeIndex)
  const [to, setTo] = useState(activeIndex)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [footerRevealed, setFooterRevealed] = useState(false)
  const [footerLock, setFooterLock] = useState(false)
  // 锁占用者的响应式镜像：全局菜单等需要按「是否有别的浮层开着」显隐自身。
  const [overlayLockKeys, setOverlayLockKeys] = useState<ReadonlySet<string>>(() => new Set())

  const activeIndexRef = useRef(activeIndex)
  const footerRevealedRef = useRef(footerRevealed)
  const footerLockRef = useRef(footerLock)
  const lockedRef = useRef(false)
  const fromRef = useRef(from)
  const toRef = useRef(to)
  const reducedMotionRef = useRef(reducedMotion)
  const overlayLockRef = useRef(false)
  // 按 key 记录锁占用者（系列详情、全局菜单等），允许浮层叠加：
  // effect 写法「set(key, cond) + cleanup set(key, false)」下同一 key 幂等，
  // 全部 key 释放后才算解锁。
  const overlayLockKeysRef = useRef(new Set<string>())

  activeIndexRef.current = activeIndex
  footerRevealedRef.current = footerRevealed
  footerLockRef.current = footerLock
  fromRef.current = from
  toRef.current = to
  reducedMotionRef.current = reducedMotion
  lockedRef.current = from !== to || footerLock || overlayLockRef.current

  useEffect(() => subscribePrefersReducedMotion(setReducedMotion), [])

  const setOverlayLock = useCallback((key: string, locked: boolean) => {
    setOverlayLockKeys((prev) => {
      const next = new Set(prev)
      if (locked) {
        next.add(key)
      } else {
        next.delete(key)
      }
      return next
    })
    if (locked) {
      overlayLockKeysRef.current.add(key)
    } else {
      overlayLockKeysRef.current.delete(key)
    }
    const overlayLocked = overlayLockKeysRef.current.size > 0
    overlayLockRef.current = overlayLocked
    lockedRef.current = fromRef.current !== toRef.current || footerLockRef.current || overlayLocked
  }, [])

  useSeamTransition({
    from,
    to,
    durationMs: WIPE_MS,
    reducedMotion,
    layerRefs,
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
    /** 谱线切页进行中（页脚揭示不算）：全局菜单按钮据此做缩小-放大出入场。 */
    wiping: from !== to,
    footerLock,
    reducedMotion,
    to,
    overlayLockKeys,
    setOverlayLock,
  }
}
