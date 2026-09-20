import { SERIES_WORKS } from '@/constants/seriesCovers'
import { STAFF_BEAM_GROUPS, seriesStaffNote } from '@/constants/seriesStaff'
import { noteLeftPercent, pitchTopPercent } from '@/lib/seriesStaffLayout'

type FieldBox = { w: number; h: number; rem: number; glyphH: number }

/**
 * 谱面记谱层：把相邻的作品音符连成符杠组（上行/下行随音高倾斜）、句尾的
 * rit.——让时间轴读起来是一句正在演奏的旋律。符干端点按 StaffGlyph 的
 * viewBox 几何精确推导：符干端在字形盒 27.8/32 处（两端对称），符杠端点
 * = 音高锚点 ± (0.86875×盒高 − 符头下沉量)，桌面/移动两档字形尺寸下
 * 符杠都恰好吻在符干端上。
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
  const { w, h, glyphH } = box
  // 与 CSS --head-nudge（0.36rem / 窄屏 0.26rem）同步：窄屏按 640px 断点折算
  const nudge = (w <= 640 ? 0.26 : 0.36) * box.rem
  const th = Math.max(3, glyphH * 0.1) // 符杠厚度随字形盒缩放
  const gap = th * 0.75 // 双杠间距
  // 符头锚点 → 符干端的符干长度（27.8/32 来自 StaffGlyph 的 viewBox 几何）
  const stemRise = (27.8 / 32) * glyphH - nudge

  const stemEnd = (index: number) => {
    const x = (noteLeftPercent(index, count) / 100) * w
    const y = (pitchTopPercent(seriesStaffNote(index).pitch) / 100) * h
    const down = seriesStaffNote(index).pitch >= 5
    return { x, y: down ? y + stemRise : y - stemRise, down }
  }

  const beamPolygons: { d: string; active: boolean }[] = []
  for (const group of STAFF_BEAM_GROUPS) {
    const a = stemEnd(group.start)
    const b = stemEnd(group.start + 1)
    // 第二道杠往远离符头的方向叠（符干朝下就向下叠，朝上就向上叠）
    const offsets = group.double ? (a.down ? [0, th + gap] : [0, -(th + gap)]) : [0]
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
