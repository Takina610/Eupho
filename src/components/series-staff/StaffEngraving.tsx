import type { CSSProperties } from 'react'
import { SERIES_WORKS } from '@/constants/seriesCovers'
import { STAFF_BEAM_GROUPS, STAFF_KEY_FLAT_PITCHES, seriesStaffNote } from '@/constants/seriesStaff'
import { noteLeftPercent, pitchTopPercent } from '@/lib/seriesStaffLayout'

type FieldBox = { w: number; h: number; rem: number; glyphH: number }

/**
 * 谱面记谱层：把相邻的作品音符连成符杠组（上行/下行随音高倾斜）、
 * 谱号后的 B♭ 大调调号（两个降记号）、乐句尾的 rit.——让时间轴读起来
 * 是一句正在演奏的旋律。符干长度按实测字形盒高度推导（0.85×盒高 − 符头
 * 下沉量），桌面/移动两档字形尺寸下符杠都恰好落在符干端点上。
 */
export function StaffEngraving({
  box,
  count,
  activeIndex,
}: {
  box: FieldBox
  count: number
  activeIndex: number
}) {
  const { w, h, rem, glyphH } = box
  // 与 CSS --head-nudge（0.36rem / 窄屏 0.26rem）同步：窄屏按 640px 断点折算
  const nudge = (w <= 640 ? 0.26 : 0.36) * rem
  const th = Math.max(3, glyphH * 0.1) // 符杠厚度随字形盒缩放
  const gap = th * 0.75 // 双杠间距
  const reach = glyphH * 0.85 - nudge // 符头锚点 → 符杠端符干长度

  const stemEnd = (index: number) => {
    const x = (noteLeftPercent(index, count) / 100) * w
    const y = (pitchTopPercent(seriesStaffNote(index).pitch) / 100) * h
    const down = seriesStaffNote(index).pitch >= 5
    return { x, y: y + (down ? reach : -reach), down }
  }

  const beamPolygons: { d: string; active: boolean }[] = []
  for (const group of STAFF_BEAM_GROUPS) {
    const a = stemEnd(group.start)
    const b = stemEnd(group.start + 1)
    const offsets = group.double ? (a.down ? [0, -(th + gap)] : [0, th + gap]) : [0]
    const active = activeIndex === group.start || activeIndex === group.start + 1
    for (const offset of offsets) {
      const y1 = a.y + offset
      const y2 = b.y + offset
      beamPolygons.push({
        d: `M${a.x} ${y1} L${b.x} ${y2} l0 ${th} L${a.x} ${y1 + th} Z`,
        active,
      })
    }
  }

  return (
    <>
      {/* 调号：B♭ 大调，两个降记号坐在各自的线/间上 */}
      {STAFF_KEY_FLAT_PITCHES.map((pitch, flatIndex) => (
        <svg
          key={pitch}
          className="series-staff__flat"
          viewBox="0 0 8 12"
          aria-hidden
          style={
            {
              left: `${8.6 + flatIndex * 2.8}%`,
              top: `${pitchTopPercent(pitch)}%`,
              '--flat-i': flatIndex,
            } as CSSProperties
          }
        >
          <path d="M2 .6 V11.4" fill="none" stroke="currentColor" strokeWidth={1.3} />
          <path d="M2 5 C 5.6 3.4, 7.8 5.4, 7.5 7.6 C 7.2 9.9, 4.2 10.7, 2 9.2 Z" fill="currentColor" />
        </svg>
      ))}

      {/* 符杠：连接成组音符的符干，随音高差倾斜 */}
      <svg
        className="series-staff__beams"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        aria-hidden
      >
        {beamPolygons.map(({ d, active }) => (
          <path key={d} d={d} className={active ? 'is-active' : undefined} />
        ))}
      </svg>

      {SERIES_WORKS.length === count ? (
        <span className="series-staff__rit" aria-hidden>
          rit.
        </span>
      ) : null}
    </>
  )
}
