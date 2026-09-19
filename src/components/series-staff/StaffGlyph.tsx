/**
 * 刻谱风音符字形：细符干、椭圆符头、波浪符尾、双杠连音，参考乐谱 engraving
 * 惯例自绘，替代早期 iconfont 粗块图标。fill 走 currentColor，由 CSS 控制配色
 * （未激活白、激活黄）。符干向下由外层 `.is-stem-down` 的 scaleY(-1) 完成。
 */
const HEAD_RX = 4.4
const HEAD_RY = 3.2

function NoteHead({ cx, cy }: { cx: number; cy: number }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={HEAD_RX}
      ry={HEAD_RY}
      transform={`rotate(-20 ${cx} ${cy})`}
    />
  )
}

function Stem({ x, top }: { x: number; top: number }) {
  return <rect x={x} y={top} width={1.15} height={25.4 - top} />
}

/** 八分音符符尾：从符干顶端向右下扫出的实心月牙 */
function Flag({ x, top }: { x: number; top: number }) {
  return (
    <path
      d={`M${x + 1.15} ${top} C ${x + 5.4} ${top + 2.4}, ${x + 6.9} ${top + 7.4}, ${x + 4.9} ${
        top + 12.4
      } C ${x + 5.5} ${top + 7.8}, ${x + 3.9} ${top + 5}, ${x} ${top + 3.6} Z`}
    />
  )
}

export function StaffGlyph({ kind }: { kind: 'quarter' | 'eighth' | 'beamed' | 'sixteenths' }) {
  return (
    <span className="series-staff__glyph">
      <span className="series-staff__motion">
        {kind === 'quarter' ? (
          <svg className="series-staff__shape" viewBox="0 0 22 32" aria-hidden>
            <NoteHead cx={6.4} cy={26.2} />
            <Stem x={10.15} top={4.8} />
          </svg>
        ) : kind === 'eighth' ? (
          <svg className="series-staff__shape" viewBox="0 0 24 32" aria-hidden>
            <NoteHead cx={6.4} cy={26.2} />
            <Stem x={10.15} top={4.8} />
            <Flag x={10.15} top={4.8} />
          </svg>
        ) : kind === 'beamed' ? (
          <svg className="series-staff__shape" viewBox="0 0 34 32" aria-hidden>
            <NoteHead cx={6.4} cy={26.4} />
            <NoteHead cx={27.4} cy={24.6} />
            <Stem x={10.15} top={6.4} />
            <Stem x={31.15} top={4.6} />
            <path d="M10.15 6.4 L32.3 4.6 v3.4 L10.15 9.8 Z" />
          </svg>
        ) : (
          <svg className="series-staff__shape" viewBox="0 0 34 32" aria-hidden>
            <NoteHead cx={6.4} cy={26.4} />
            <NoteHead cx={27.4} cy={24.6} />
            <Stem x={10.15} top={4.6} />
            <Stem x={31.15} top={2.8} />
            <path d="M10.15 4.6 L32.3 2.8 v3.4 L10.15 8 Z" />
            <path d="M10.15 10 L32.3 8.2 v3.4 L10.15 13.4 Z" />
          </svg>
        )}
      </span>
    </span>
  )
}
