import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ^<>-*'

/**
 * 菜单条目的字符切换效果：active 翻转时（悬入或悬出）字符先随机滚动，
 * 再从左到右逐个落定为真实文案。用 interval 而非 rAF 驱动——文本闪烁
 * 不需要 vsync，且标签页渲染被挂起时定时器仍会走，动画不会卡死在半途。
 */
export function useScramble(text: string, active: boolean, activeMs = 420, idleMs = 200) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(text)
      return
    }

    const duration = active ? activeMs : idleMs
    const start = performance.now()
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / duration)
      if (p >= 1) {
        setDisplay(text)
        return
      }
      const settledCount = Math.floor(p * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        out += i < settledCount ? text[i] : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
      }
      setDisplay(out)
    }
    const interval = window.setInterval(tick, 30)
    const settle = window.setTimeout(() => setDisplay(text), duration + 80)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(settle)
    }
  }, [active, text, activeMs, idleMs])

  return display
}
