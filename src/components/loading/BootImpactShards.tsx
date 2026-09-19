import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'
import { isBootRevealed, whenBootRevealed } from '@/lib/bootReveal'
import './bootImpactShards.css'

/** is-go 后最长一支碎片（delay+duration）落定即卸载整层 */
const LIFETIME_MS = 1900
/** 揭幕信号万一没来，最多等这么久自己放行 */
const REVEAL_FALLBACK_MS = 2500

type Piece = {
  kind: 'ink' | 'spark'
  sx: number
  sy: number
  sw: number
  sh: number
  sdx: number
  sdy: number
  srot: number
  srotEnd: number
  sskew: number
  sdur: number
  sdelay: number
  sc?: string
}

/** 素数种子 LCG：碎片布局每次进场一致，StrictMode 重挂也不跳变 */
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1_100_351_524_533 + 12_345) % 2_147_483_648
    return s / 2_147_483_648
  }
}

function buildPieces(): Piece[] {
  const rng = makeRng(20250919)
  const pieces: Piece[] = []
  // 墨色断面：起点贴着切口反斜线（左下→右上）散布，向外上崩飞
  for (let i = 0; i < 11; i++) {
    const sx = 8 + rng() * 84
    const alongCut = i % 2 === 0
    const sy = alongCut ? 92 - sx * 0.9 + (rng() - 0.5) * 34 : 22 + rng() * 66
    const outward = (sx - 50) / 50
    pieces.push({
      kind: 'ink',
      sx,
      sy: Math.min(Math.max(sy, 8), 92),
      sw: 6 + rng() * 11,
      sh: 2.4 + rng() * 3.6,
      sdx: outward * (10 + rng() * 15),
      sdy: -(7 + rng() * 15) + (rng() < 0.25 ? 14 + rng() * 8 : 0),
      srot: -35 + (rng() - 0.5) * 60,
      srotEnd: 40 + rng() * 130,
      sskew: (rng() - 0.5) * 56,
      sdur: 0.9 + rng() * 0.5,
      sdelay: rng() * 0.16,
    })
  }
  // 刀光碎屑：细亮线顺着挥斩方向（约 -32°）高速掠出
  for (let i = 0; i < 5; i++) {
    const sx = 18 + rng() * 60
    pieces.push({
      kind: 'spark',
      sx,
      sy: 76 - sx * 0.7 + (rng() - 0.5) * 20,
      sw: 13 + rng() * 10,
      sh: 2 + rng() * 1.5,
      sdx: 16 + rng() * 16,
      sdy: -(9 + rng() * 11),
      srot: -32 + (rng() - 0.5) * 18,
      srotEnd: -32 + (rng() - 0.5) * 12,
      sskew: 0,
      sdur: 0.5 + rng() * 0.26,
      sdelay: rng() * 0.1,
      sc: i % 2 === 0 ? '#fff830' : '#9ff3ff',
    })
  }
  return pieces
}

const PIECES = buildPieces()

/**
 * 揭幕冲击碎片：挂载后等 bootReveal 信号（挥刀起手帧），随后播一道
 * 刀光闪 + 碎片溅射，播完自卸载。reduced-motion 下整层不渲染。
 */
export function BootImpactShards() {
  const [gone, setGone] = useState(() => prefersReducedMotion())
  const [go, setGo] = useState(false)

  useEffect(() => {
    if (gone) return
    let timer = 0
    let fallbackTimer = 0
    let released = false
    const release = () => {
      if (released) return
      released = true
      window.clearTimeout(fallbackTimer)
      setGo(true)
      timer = window.setTimeout(() => setGone(true), LIFETIME_MS)
    }
    if (isBootRevealed()) {
      release()
    } else {
      fallbackTimer = window.setTimeout(release, REVEAL_FALLBACK_MS)
      void whenBootRevealed().then(release)
    }
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(fallbackTimer)
    }
  }, [gone])

  if (gone) return null

  return (
    <div className={`boot-shards${go ? ' is-go' : ''}`} aria-hidden="true">
      <span className="boot-shards__flash" />
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`boot-shards__piece boot-shards__piece--${p.kind}`}
          style={
            {
              '--sx': `${p.sx}%`,
              '--sy': `${p.sy}%`,
              '--sw': `${p.sw}vmin`,
              '--sh': `${p.sh}${p.kind === 'spark' ? 'px' : 'vmin'}`,
              '--sdx': `${p.sdx}vw`,
              '--sdy': `${p.sdy}vh`,
              '--srot': `${p.srot}deg`,
              '--srot-end': `${p.srotEnd}deg`,
              '--sskew': `${p.sskew}deg`,
              '--sdur': `${p.sdur}s`,
              '--sdelay': `${p.sdelay}s`,
              '--sc': p.sc ?? '#fff830',
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
