import { useEffect, useRef, type RefObject } from 'react'
import type Lenis from 'lenis'

import { getScrollRegionLenis } from '@/lib/scrollRegion'

const WHEEL_THRESHOLD = 24
const SWIPE_THRESHOLD = 48
/** 小于此位移视为「没滚动」（滤掉像素取整抖动）。 */
const SCROLL_MOVE_EPSILON = 2

function isFullpageIgnored(target: EventTarget | null) {
  return target instanceof Element && target.closest('[data-fullpage-ignore]') != null
}

/** 当前激活屏里可滚动的长内容区（如移动端 Introduction 长屏）；无溢出时视为不存在。 */
function findActiveScrollRegion() {
  const region = document.querySelector<HTMLElement>('[data-active="true"] [data-fullpage-scroll]')
  if (!region || region.scrollHeight <= region.clientHeight + 1) {
    return null
  }
  return region
}

function isAtScrollEdge(region: HTMLElement, goingDown: boolean) {
  const maxScroll = region.scrollHeight - region.clientHeight
  return goingDown ? region.scrollTop >= maxScroll - 1 : region.scrollTop <= 1
}

/**
 * 滚动区是否已滚到该方向的边缘。Lenis 托管的区域实际能滚到哪由它的 limit 决定，
 * 而 limit 只在尺寸变化时重算（纯滚动溢出变化不触发），可能比 DOM 的
 * scrollHeight - clientHeight 小几像素——此时光看 DOM 永远够不到边缘。
 * 两边任一到底就算到底：不会卡在差几像素处翻不了页。
 */
function isScrollRegionAtEdge(region: HTMLElement, goingDown: boolean) {
  if (isAtScrollEdge(region, goingDown)) {
    return true
  }

  const lenis = getScrollRegionLenis(region)
  if (!lenis) {
    return false
  }

  return goingDown ? lenis.targetScroll >= lenis.limit - 1 : lenis.targetScroll <= 1
}

type ScrollSnapshot = {
  scrollTop: number
  targetScroll: number
  lenis: Lenis | null
}

/**
 * 这段手势期间滚动区有没有真的滚动。触摸翻页的判据取「动没动」而不是「到没到边缘」：
 * 上限算出来的边缘和 Lenis 实际能滚到的位置可能差几像素，按边缘判会卡死翻不了页。
 * Lenis 的目标位置随手指同步更新，DOM 的 scrollTop 会晚一帧，两个都算。
 */
function hasScrollRegionMoved(region: HTMLElement, snapshot: ScrollSnapshot) {
  if (Math.abs(region.scrollTop - snapshot.scrollTop) > SCROLL_MOVE_EPSILON) {
    return true
  }

  const lenis = getScrollRegionLenis(region)
  return (
    lenis != null &&
    lenis === snapshot.lenis &&
    Math.abs(lenis.targetScroll - snapshot.targetScroll) > SCROLL_MOVE_EPSILON
  )
}

type UseFullpageInputOptions = {
  lockedRef: RefObject<boolean>
  onStep: (delta: 1 | -1) => void
  onGoTo: (index: number) => void
  pageCount: number
  targetRef: RefObject<HTMLElement | null>
}

export function useFullpageInput({
  lockedRef,
  onStep,
  onGoTo,
  pageCount,
  targetRef,
}: UseFullpageInputOptions) {
  const onStepRef = useRef(onStep)
  const onGoToRef = useRef(onGoTo)
  const touchStart = useRef<{
    ignore: boolean
    x: number
    y: number
    lastY: number
    scrollRegion: HTMLElement | null
    /** 手势开始时滚动区的位置，抬手时据此判断这段手势是滚动还是翻页。 */
    scrollSnapshot: ScrollSnapshot | null
  } | null>(null)
  onStepRef.current = onStep
  onGoToRef.current = onGoTo

  useEffect(() => {
    const surface: EventTarget = targetRef.current ?? window

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      const delta = absX > absY ? event.deltaX : event.deltaY
      if (lockedRef.current || Math.abs(delta) < WHEEL_THRESHOLD) {
        return
      }

      // 激活屏内有长内容区时先滚内容，滚到边缘才继续翻页。
      // Lenis 托管的区域滚动由它自己平滑驱动，这里只负责边缘判定。
      const region = findActiveScrollRegion()
      if (region && !isScrollRegionAtEdge(region, delta > 0)) {
        if (!getScrollRegionLenis(region)) {
          region.scrollTop += delta * (event.deltaMode === 1 ? 16 : 1)
        }
        return
      }

      onStepRef.current(delta > 0 ? 1 : -1)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      if (isFullpageIgnored(target) && event.key.startsWith('Arrow')) {
        return
      }

      if (lockedRef.current) {
        if (['ArrowRight', 'ArrowDown', 'PageDown', 'ArrowLeft', 'ArrowUp', 'PageUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault()
        }
        return
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault()
          onStepRef.current(1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault()
          onStepRef.current(-1)
          break
        case 'Home':
          event.preventDefault()
          onGoToRef.current(0)
          break
        case 'End':
          event.preventDefault()
          onGoToRef.current(pageCount - 1)
          break
        default:
          break
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) {
        touchStart.current = null
        return
      }

      const region = findActiveScrollRegion()
      const inRegion =
        region != null && event.target instanceof Element && region.contains(event.target)
      const scrollRegion = inRegion ? region : null
      const lenis = scrollRegion ? getScrollRegionLenis(scrollRegion) : null
      touchStart.current = {
        ignore: isFullpageIgnored(event.target),
        x: touch.clientX,
        y: touch.clientY,
        lastY: touch.clientY,
        scrollRegion,
        scrollSnapshot:
          scrollRegion == null
            ? null
            : {
                scrollTop: scrollRegion.scrollTop,
                targetScroll: lenis?.targetScroll ?? 0,
                lenis,
              },
      }
    }

    const onTouchMove = (event: TouchEvent) => {
      const start = touchStart.current
      if (!start) {
        return
      }

      const touch = event.touches[0]
      if (!touch) {
        return
      }

      // 滚动区手势：滚动交给 Lenis（未托管时手动 scrollTop 兜底），全程不触发翻页，
      // 翻页统一留给 touchend 的边缘判定
      if (start.scrollRegion) {
        const lenis = getScrollRegionLenis(start.scrollRegion)
        if (!lenis) {
          start.scrollRegion.scrollTop += start.lastY - touch.clientY
          start.lastY = touch.clientY
        }
        event.preventDefault()
        return
      }

      if (start.ignore) {
        const dx = touch.clientX - start.x
        const dy = touch.clientY - start.y
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
          event.preventDefault()
        }
        return
      }

      event.preventDefault()
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStart.current == null) {
        return
      }

      const end = event.changedTouches[0]
      const start = touchStart.current
      touchStart.current = null
      if (!end || lockedRef.current) {
        return
      }

      const deltaX = start.x - end.clientX
      const deltaY = start.y - end.clientY

      // 滚动区手势：这段手势滚不动内容才算翻页，中途滚动一律不翻页
      // （一次长甩只把内容滚到底，不会顺带翻页，末尾来不及看）
      if (start.scrollRegion) {
        if (Math.abs(deltaY) < SWIPE_THRESHOLD || Math.abs(deltaX) >= Math.abs(deltaY)) {
          return
        }
        const snapshot = start.scrollSnapshot
        if (snapshot == null || !hasScrollRegionMoved(start.scrollRegion, snapshot)) {
          onStepRef.current(deltaY > 0 ? 1 : -1)
        }
        return
      }

      if (start.ignore && Math.abs(deltaX) >= Math.abs(deltaY)) {
        return
      }

      const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY
      if (Math.abs(delta) < SWIPE_THRESHOLD) {
        return
      }

      onStepRef.current(delta > 0 ? 1 : -1)
    }

    surface.addEventListener('wheel', onWheel as EventListener, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    surface.addEventListener('touchstart', onTouchStart as EventListener, { passive: true })
    surface.addEventListener('touchmove', onTouchMove as EventListener, { passive: false })
    surface.addEventListener('touchend', onTouchEnd as EventListener, { passive: true })

    return () => {
      surface.removeEventListener('wheel', onWheel as EventListener)
      window.removeEventListener('keydown', onKeyDown)
      surface.removeEventListener('touchstart', onTouchStart as EventListener)
      surface.removeEventListener('touchmove', onTouchMove as EventListener)
      surface.removeEventListener('touchend', onTouchEnd as EventListener)
    }
  }, [lockedRef, pageCount, targetRef])
}
