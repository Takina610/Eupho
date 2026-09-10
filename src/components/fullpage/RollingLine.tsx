import { useEffect, useRef, useState } from 'react'
import { COUNTER_LINE_MS, COUNTER_SWAP_AT, WIPE_MS } from '@/constants/fullpageMotion'
import { EASE_IN_OUT_QUAD_CSS } from '@/lib/easing'
import { prefersReducedMotion } from '@/lib/motion'

type RollingLineProps = {
  value: string
  direction: 1 | -1
  delayMs: number
  className?: string
}

export function RollingLine({ value, direction, delayMs, className = '' }: RollingLineProps) {
  const [display, setDisplay] = useState(value)
  const [shift, setShift] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [motion, setMotion] = useState('none')
  const skip = useRef(true)

  useEffect(() => {
    if (skip.current) {
      skip.current = false
      setDisplay(value)
      return
    }

    if (prefersReducedMotion()) {
      setMotion('none')
      setShift(0)
      setOpacity(1)
      setDisplay(value)
      return
    }

    const outY = direction > 0 ? -1 : 1
    const lineMs = COUNTER_LINE_MS
    const ease = `transform ${lineMs}ms ${EASE_IN_OUT_QUAD_CSS}, opacity ${lineMs}ms ${EASE_IN_OUT_QUAD_CSS}`
    let rafA = 0
    let rafB = 0

    const outTimer = window.setTimeout(() => {
      setMotion(ease)
      setShift(outY)
      setOpacity(0)
    }, delayMs)

    const swapTimer = window.setTimeout(() => {
      setMotion('none')
      setDisplay(value)
      setShift(-outY)
      setOpacity(0)
      rafA = requestAnimationFrame(() => {
        rafB = requestAnimationFrame(() => {
          setMotion(ease)
          setShift(0)
          setOpacity(1)
        })
      })
    }, WIPE_MS * COUNTER_SWAP_AT)

    return () => {
      window.clearTimeout(outTimer)
      window.clearTimeout(swapTimer)
      cancelAnimationFrame(rafA)
      cancelAnimationFrame(rafB)
    }
  }, [value, direction, delayMs])

  return (
    <div className="overflow-hidden leading-none">
      <div
        className={className}
        style={{
          opacity,
          transform: `translateY(${shift * 2}rem)`,
          transition: motion,
        }}
      >
        {display}
      </div>
    </div>
  )
}
