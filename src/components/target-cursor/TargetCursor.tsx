import { useEffect, useMemo, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { createTargetLock } from './targetLock'
import { createCursorSpin } from './cursorSpin'
import { getContainingBlock, getContainingBlockOffset } from './targetFrame'
import './TargetCursor.css'

type TargetCursorProps = {
  /** 命中该选择器的元素会触发四角锁定 */
  targetSelector: string
  /** 光标可见与默认指针隐藏只在该选择器命中的子树内生效;不传则全页生效 */
  boundsSelector?: string
  spinDuration?: number
  hideDefaultCursor?: boolean
  hoverDuration?: number
  parallaxOn?: boolean
  cursorColor?: string
  cursorColorOnTarget?: string
}

function detectMobile() {
  if (typeof window === 'undefined') {
    return false
  }
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth <= 768
  const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    (navigator.userAgent || '').toLowerCase(),
  )
  return (hasTouchScreen && isSmallScreen) || isMobileUserAgent
}

export function TargetCursor({
  targetSelector,
  boundsSelector,
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = false,
  cursorColor = '#ffffff',
  cursorColorOnTarget,
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cornersRef = useRef<HTMLElement[]>([])
  const dotRef = useRef<HTMLDivElement>(null)
  const containingBlockRef = useRef<HTMLElement | null>(null)
  const spinRef = useRef<ReturnType<typeof createCursorSpin> | null>(null)

  const isMobile = useMemo(() => detectMobile(), [])

  const moveCursor = useCallback((x: number, y: number) => {
    const cursor = cursorRef.current
    if (!cursor) {
      return
    }
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current)
    gsap.to(cursor, { x: x - offsetX, y: y - offsetY, duration: 0.1, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    if (isMobile || !cursorRef.current) {
      return
    }

    const cursor = cursorRef.current
    cornersRef.current = Array.from(cursor.querySelectorAll<HTMLElement>('.target-cursor-corner'))
    containingBlockRef.current = getContainingBlock(cursor)
    const getOffset = () => getContainingBlockOffset(containingBlockRef.current)

    const bounds = boundsSelector ? document.querySelector<HTMLElement>(boundsSelector) : null
    const cursorHost: HTMLElement = bounds ?? document.body
    if (hideDefaultCursor) {
      cursorHost.setAttribute('data-tc-hide-cursor', '')
    }

    const inBounds = (node: EventTarget | null): node is Element =>
      node instanceof Element && (!boundsSelector || node.closest(boundsSelector) !== null)

    // 可见性不只依赖 mousemove:滚轮/键盘切页后指针未动、指针下的层已更换,
    // 需要按最后鼠标位置定期复测,否则准星会残留在其他屏上。
    let lastMouse = { x: Number.NaN, y: Number.NaN }
    let isVisible = false
    const setVisible = (visible: boolean) => {
      if (visible === isVisible) {
        return
      }
      isVisible = visible
      gsap.to(cursor, { opacity: visible ? 1 : 0, duration: 0.15, ease: 'power2.out', overwrite: 'auto' })
    }
    const syncVisibility = () => {
      if (Number.isNaN(lastMouse.x)) {
        return
      }
      setVisible(inBounds(document.elementFromPoint(lastMouse.x, lastMouse.y)))
    }
    const visibilityTimer = window.setInterval(syncVisibility, 200)

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - getOffset().x,
      y: window.innerHeight / 2 - getOffset().y,
    })

    const spin = createCursorSpin(cursor, spinDuration)
    spinRef.current = spin
    spin.build()

    const lock = createTargetLock({
      cursor: () => cursorRef.current,
      corners: () => cornersRef.current,
      dot: () => dotRef.current,
      pauseSpin: () => spin.pause(),
      resumeSpin: () => spin.resume(),
      getOffset,
      hoverDuration,
      parallaxOn,
      cursorColor,
      cursorColorOnTarget,
    })

    const moveHandler = (event: MouseEvent) => {
      lastMouse = { x: event.clientX, y: event.clientY }
      moveCursor(event.clientX, event.clientY)
      syncVisibility()
    }
    window.addEventListener('mousemove', moveHandler)

    const enterHandler = (event: MouseEvent) => {
      if (!inBounds(event.target)) {
        return
      }
      let current = event.target instanceof Element ? event.target : null
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          lock.lock(current)
          return
        }
        current = current.parentElement
      }
    }
    window.addEventListener('mouseover', enterHandler, { passive: true })

    const scrollHandler = () => {
      const target = lock.getActiveTarget()
      if (!target) {
        return
      }
      const { x: offsetX, y: offsetY } = getOffset()
      const mouseX = Number(gsap.getProperty(cursorRef.current, 'x')) + offsetX
      const mouseY = Number(gsap.getProperty(cursorRef.current, 'y')) + offsetY
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY)
      const isStillOverTarget =
        elementUnderMouse && (elementUnderMouse === target || elementUnderMouse.closest(targetSelector) === target)
      if (!isStillOverTarget) {
        lock.unlock()
      }
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })

    const mouseDownHandler = () => {
      if (!dotRef.current) {
        return
      }
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 })
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 })
    }
    const mouseUpHandler = () => {
      if (!dotRef.current) {
        return
      }
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 })
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 })
    }
    window.addEventListener('mousedown', mouseDownHandler)
    window.addEventListener('mouseup', mouseUpHandler)

    const resizeHandler = () => {
      containingBlockRef.current = getContainingBlock(cursor)
    }
    window.addEventListener('resize', resizeHandler)

    return () => {
      window.clearInterval(visibilityTimer)
      window.removeEventListener('mousemove', moveHandler)
      window.removeEventListener('mouseover', enterHandler)
      window.removeEventListener('scroll', scrollHandler)
      window.removeEventListener('mousedown', mouseDownHandler)
      window.removeEventListener('mouseup', mouseUpHandler)
      window.removeEventListener('resize', resizeHandler)

      lock.destroy()
      spin.kill()
      spinRef.current = null
      if (hideDefaultCursor) {
        cursorHost.removeAttribute('data-tc-hide-cursor')
      }
    }
  }, [
    targetSelector,
    boundsSelector,
    spinDuration,
    hideDefaultCursor,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget,
    isMobile,
    moveCursor,
  ])

  if (isMobile || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <div className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>,
    document.body,
  )
}
