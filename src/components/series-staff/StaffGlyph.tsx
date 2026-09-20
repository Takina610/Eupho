import { STAFF_TREBLE_SRC } from '@/constants/seriesStaff'

const HEAD_RX = 5
const HEAD_RY = 3.6
const STEM_W = 1.4

/**
 * 刻谱风音符字形：椭圆符头 + 细符干，参考乐谱 engraving 惯例自绘。
 * quarter = 实心符头，eighth = 带符尾，half = 空心符头（乐句收尾的长音）；
 * treble = 高音谱号剪影（沿用旧素材缩小作白色剪影记号，居中坐在音高上）。
 * fill/stroke 走 currentColor。符干向下由外层 `.is-stem-down` 的 scaleY(-1)
 * 完成；符杠由 StaffBeams 统一绘制（符干端点按本文件的 viewBox 几何推导）。
 */
export function StaffGlyph({ kind }: { kind: 'quarter' | 'eighth' | 'half' | 'treble' }) {
  return (
    <span className="series-staff__glyph">
      <span className="series-staff__motion">
        {kind === 'eighth' ? (
          <svg className="series-staff__shape" viewBox="0 0 24 32" aria-hidden>
            <ellipse cx={6.8} cy={25.8} rx={HEAD_RX} ry={HEAD_RY} transform="rotate(-20 6.8 25.8)" />
            <rect x={10.6} y={4.2} width={STEM_W} height={21.4} />
            <path d="M12 4.2 C 16.8 7, 18.4 12.2, 16.4 17.4 C 17 12.6, 15.2 9.6, 12 8.2 Z" />
          </svg>
        ) : kind === 'half' ? (
          <svg className="series-staff__shape" viewBox="0 0 22 32" aria-hidden>
            <ellipse
              cx={6.6}
              cy={25.8}
              rx={HEAD_RX - 0.4}
              ry={HEAD_RY - 0.3}
              transform="rotate(-20 6.6 25.8)"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
            />
            <rect x={10.55} y={4.2} width={STEM_W} height={21.4} />
          </svg>
        ) : kind === 'treble' ? (
          <img
            className="series-staff__shape series-staff__shape--treble"
            src={STAFF_TREBLE_SRC}
            alt=""
            draggable={false}
            aria-hidden
          />
        ) : (
          <svg className="series-staff__shape" viewBox="0 0 22 32" aria-hidden>
            <ellipse cx={6.6} cy={25.8} rx={HEAD_RX} ry={HEAD_RY} transform="rotate(-20 6.6 25.8)" />
            <rect x={10.55} y={4.2} width={STEM_W} height={21.4} />
          </svg>
        )}
      </span>
    </span>
  )
}
