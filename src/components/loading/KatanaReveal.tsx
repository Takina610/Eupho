import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './katanaReveal.css'

/** 静场 / 拔刀 / 挥斩节奏（秒）。参考 slash loading 原版（JIEJOE），把开场 1s 静场压短 */
const DRAW_DELAY_S = 0.5
const DRAW_S = 0.4
const SLASH_S = 0.9
const SLASH_OVERLAP_S = 0.3

/** 快速冲入、行至中央短暂变沉（不停不拖）、随即加速离场 */
const slashEase = (t: number) => t + (0.6 * Math.sin(2 * Math.PI * t)) / (2 * Math.PI)

/**
 * 居合斩揭幕：加载层淡出的同时，两块与加载层同色的遮罩盖屏，
 * 武士刀从底部拔出后斜劈到右上角，遮罩沿刀痕分成两半退开露出主站。
 * 遮罩初始是上下两块互补三角形（与 onUpdate 计算式同源），静场期间盖满全屏。
 */
export function KatanaReveal() {
  const [done, setDone] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const katanaRef = useRef<SVGSVGElement>(null)
  const upRef = useRef<HTMLDivElement>(null)
  const downRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const katana = katanaRef.current
    const up = upRef.current
    const down = downRef.current
    if (!katana || !up || !down) return

    // 刀刃中点即切口：两块遮罩沿切口分开，上块多让出 20% 高度形成错位缝隙
    const applyCut = () => {
      const rect = katana.getBoundingClientRect()
      const cutX = ((rect.left + rect.width) / window.innerWidth) * 100
      const cutY = ((rect.top + rect.height / 2) / window.innerHeight) * 100
      up.style.clipPath = `polygon(0% 0%, 100% 0%, ${cutX}% ${cutY}%, 0% ${cutY * 1.2}%)`
      down.style.clipPath = `polygon(100% 100%, 100% 0%, ${cutX}% ${cutY}%, ${(rect.left / window.innerWidth) * 100}% 100%)`
    }

    const tl = gsap.timeline({
      onUpdate: applyCut,
      onComplete: () => setDone(true),
    })
    tl.to(katana, {
      y: () => -katana.getBoundingClientRect().height / 2,
      duration: DRAW_S,
      ease: 'power4.out',
      delay: DRAW_DELAY_S,
    }).to(
      katana,
      {
        y: () => -katana.getBoundingClientRect().height / 2 - window.innerHeight,
        x: () => window.innerWidth,
      duration: SLASH_S,
      ease: slashEase,
      },
      `<${SLASH_OVERLAP_S}`,
    )

    const invalidate = () => tl.invalidate()
    window.addEventListener('resize', invalidate)
    return () => {
      window.removeEventListener('resize', invalidate)
      tl.kill()
    }
  }, [])

  if (done) return null

  return (
    <div className="katana-reveal" aria-hidden="true">
      <div ref={upRef} className="katana-reveal__mask katana-reveal__mask--up" />
      <svg ref={katanaRef} className="katana-reveal__katana" viewBox="0 0 68.49 760">
        <path
          d="M26.03,760H0C20.47,552.92,26.96,357.12,21.24,185.46h0C19.06,119.86,15.09,57.81,9.44,0c7.79,6.36,14.78,13.62,20.84,21.6,4.54,43.21,8.12,88.85,10.69,136.61h0c9.52,176.77,5.29,382.63-14.94,601.79Z"
          fill="#efefef"
        />
        <path
          d="M68.49,384.66c0,117.73-5.36,244.02-16.6,375.34H26.03c20.23-219.16,24.46-425.02,14.94-601.78h0c-2.57-47.77-6.15-93.41-10.69-136.62,13.66,18.01,22.54,39.66,25.05,62.92,.08,.75,.16,1.5,.22,2.26,8.49,90.41,12.94,190.6,12.94,297.88Z"
          fill="#bfbfbf"
        />
      </svg>
      <div ref={downRef} className="katana-reveal__mask katana-reveal__mask--down" />
    </div>
  )
}
