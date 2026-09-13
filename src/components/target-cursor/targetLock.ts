import { gsap } from 'gsap'
import { getEffectiveFrameRect } from './targetFrame'

// 锁定状态由本控制器持有:激活目标、四角目标位置、强度补间与 ticker 跟踪。
// 四角位置按视口坐标记录(减去 containing block 偏移),应用时再减光标当前 x/y。

const BORDER_WIDTH = 3
const CORNER_SIZE = 12

const REST_POSITIONS = [
  { x: -CORNER_SIZE * 1.5, y: -CORNER_SIZE * 1.5 },
  { x: CORNER_SIZE * 0.5, y: -CORNER_SIZE * 1.5 },
  { x: CORNER_SIZE * 0.5, y: CORNER_SIZE * 0.5 },
  { x: -CORNER_SIZE * 1.5, y: CORNER_SIZE * 0.5 },
]

export type TargetLockOptions = {
  cursor: () => HTMLElement | null
  corners: () => HTMLElement[]
  dot: () => HTMLElement | null
  pauseSpin: () => void
  resumeSpin: () => void
  getOffset: () => { x: number; y: number }
  hoverDuration: number
  parallaxOn: boolean
  cursorColor: string
  cursorColorOnTarget?: string
}

export function createTargetLock(options: TargetLockOptions) {
  const strength = { current: 0 }
  let cornerPositions: { x: number; y: number }[] | null = null
  let activeTarget: Element | null = null
  let leaveHandler: (() => void) | null = null
  let resumeTimeout: number | null = null
  let lastRectAt = 0

  const computePositions = (target: Element) => {
    const rect = getEffectiveFrameRect(target)
    const { x: offsetX, y: offsetY } = options.getOffset()
    return [
      { x: rect.left - BORDER_WIDTH - offsetX, y: rect.top - BORDER_WIDTH - offsetY },
      { x: rect.right + BORDER_WIDTH - CORNER_SIZE - offsetX, y: rect.top - BORDER_WIDTH - offsetY },
      { x: rect.right + BORDER_WIDTH - CORNER_SIZE - offsetX, y: rect.bottom + BORDER_WIDTH - CORNER_SIZE - offsetY },
      { x: rect.left - BORDER_WIDTH - offsetX, y: rect.bottom + BORDER_WIDTH - CORNER_SIZE - offsetY },
    ]
  }

  const tickerFn = (time: number) => {
    const cursor = options.cursor()
    if (!cursor || !cornerPositions || strength.current === 0) {
      return
    }
    // 目标框会因文案切换、揭示动画或窗口缩放而移动,节流复测保持四角贴合。
    if (activeTarget && time - lastRectAt > 0.15) {
      lastRectAt = time
      cornerPositions = computePositions(activeTarget)
    }
    const positions = cornerPositions
    const cursorX = Number(gsap.getProperty(cursor, 'x'))
    const cursorY = Number(gsap.getProperty(cursor, 'y'))
    options.corners().forEach((corner, i) => {
      const currentX = Number(gsap.getProperty(corner, 'x'))
      const currentY = Number(gsap.getProperty(corner, 'y'))
      const targetX = positions[i].x - cursorX
      const targetY = positions[i].y - cursorY
      const finalX = currentX + (targetX - currentX) * strength.current
      const finalY = currentY + (targetY - currentY) * strength.current
      const duration = strength.current >= 0.99 ? (options.parallaxOn ? 0.2 : 0) : 0.05
      const tween = { x: finalX, y: finalY, overwrite: 'auto' as const }
      if (duration === 0) {
        gsap.set(corner, tween)
      } else {
        gsap.to(corner, { ...tween, duration, ease: 'power1.out' })
      }
    })
  }

  const detachLeave = () => {
    if (leaveHandler && activeTarget) {
      activeTarget.removeEventListener('mouseleave', leaveHandler)
    }
    leaveHandler = null
  }

  const lock = (target: Element) => {
    if (activeTarget === target) {
      return
    }
    detachLeave()
    if (resumeTimeout !== null) {
      clearTimeout(resumeTimeout)
      resumeTimeout = null
    }

    activeTarget = target
    const corners = options.corners()
    gsap.killTweensOf(corners, 'x,y')
    options.pauseSpin()

    if (options.cursorColorOnTarget) {
      gsap.to(corners, {
        borderColor: options.cursorColorOnTarget,
        duration: 0.15,
        ease: 'power2.out',
      })
      const dot = options.dot()
      if (dot) {
        gsap.to(dot, { backgroundColor: options.cursorColorOnTarget, duration: 0.15, ease: 'power2.out' })
      }
    }

    cornerPositions = computePositions(target)
    lastRectAt = 0
    gsap.ticker.add(tickerFn)
    gsap.to(strength, { current: 1, duration: options.hoverDuration, ease: 'power2.out', overwrite: true })

    const cursor = options.cursor()
    if (cursor) {
      const cursorX = Number(gsap.getProperty(cursor, 'x'))
      const cursorY = Number(gsap.getProperty(cursor, 'y'))
      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: cornerPositions![i].x - cursorX,
          y: cornerPositions![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out',
        })
      })
    }

    leaveHandler = () => unlock()
    target.addEventListener('mouseleave', leaveHandler)
  }

  const unlock = () => {
    gsap.ticker.remove(tickerFn)
    gsap.killTweensOf(strength)
    strength.current = 0
    cornerPositions = null

    const corners = options.corners()
    if (options.cursorColorOnTarget && corners.length > 0) {
      gsap.to(corners, { borderColor: options.cursorColor, duration: 0.15, ease: 'power2.out' })
      const dot = options.dot()
      if (dot) {
        gsap.to(dot, { backgroundColor: options.cursorColor, duration: 0.15, ease: 'power2.out' })
      }
    }
    if (corners.length > 0) {
      gsap.killTweensOf(corners, 'x,y')
      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: REST_POSITIONS[i].x,
          y: REST_POSITIONS[i].y,
          duration: 0.3,
          ease: 'power3.out',
        })
      })
    }

    resumeTimeout = window.setTimeout(() => {
      resumeTimeout = null
      if (!activeTarget) {
        options.resumeSpin()
      }
    }, 50)

    detachLeave()
    activeTarget = null
  }

  const destroy = () => {
    gsap.ticker.remove(tickerFn)
    if (resumeTimeout !== null) {
      clearTimeout(resumeTimeout)
      resumeTimeout = null
    }
    detachLeave()
    activeTarget = null
    cornerPositions = null
    strength.current = 0
  }

  return {
    lock,
    unlock,
    destroy,
    getActiveTarget: () => activeTarget,
  }
}

export type TargetLock = ReturnType<typeof createTargetLock>
