import { useEffect, useRef, useState } from 'react'
import { easeInOutQuad } from '@/lib/easing'

type UseSeamTransitionOptions = {
  from: number
  to: number
  durationMs: number
  reducedMotion: boolean
  onComplete: () => void
}

export function useSeamTransition({
  from,
  to,
  durationMs,
  reducedMotion,
  onComplete,
}: UseSeamTransitionOptions) {
  const [rawT, setRawT] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (from === to) {
      setRawT(1)
      setIsAnimating(false)
      return
    }

    if (reducedMotion) {
      setRawT(1)
      setIsAnimating(false)
      onCompleteRef.current()
      return
    }

    let raf = 0
    let watchdog = 0
    let cancelled = false
    setRawT(0)
    setIsAnimating(true)
    const start = performance.now()

    const finish = () => {
      if (cancelled) {
        return
      }
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(watchdog)
      setRawT(1)
      setIsAnimating(false)
      onCompleteRef.current()
    }

    const tick = (now: number) => {
      if (cancelled) {
        return
      }

      const next = Math.min(1, (now - start) / durationMs)
      setRawT(next)
      if (next < 1) {
        raf = requestAnimationFrame(tick)
        return
      }

      finish()
    }

    raf = requestAnimationFrame(tick)
    watchdog = window.setTimeout(finish, durationMs + 48)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(watchdog)
    }
  }, [from, to, durationMs, reducedMotion])

  return {
    progress: easeInOutQuad(rawT),
    rawT,
    isAnimating,
  }
}
