import { useLayoutEffect, useRef, useState } from 'react'
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
  const onCompleteRef = useRef(onComplete)
  const rawTPairRef = useRef(`${from}:${to}`)
  onCompleteRef.current = onComplete

  const pair = `${from}:${to}`
  const displayRawT = from === to || reducedMotion ? 1 : rawTPairRef.current !== pair ? 0 : rawT

  useLayoutEffect(() => {
    rawTPairRef.current = pair

    if (from === to) {
      setRawT(1)
      return
    }

    if (reducedMotion) {
      setRawT(1)
      onCompleteRef.current()
      return
    }

    let raf = 0
    let watchdog = 0
    let cancelled = false
    setRawT(0)
    const start = performance.now()

    const finish = () => {
      if (cancelled) {
        return
      }
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(watchdog)
      setRawT(1)
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
  }, [from, to, durationMs, reducedMotion, pair])

  return {
    progress: easeInOutQuad(displayRawT),
    rawT: displayRawT,
    isAnimating: from !== to && !reducedMotion,
  }
}
