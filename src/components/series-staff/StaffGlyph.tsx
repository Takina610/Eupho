const HEAD_RX = 5
const HEAD_RY = 3.6
const STEM_W = 1.4

/**
 * 刻谱风音符字形：椭圆符头 + 细符干，参考乐谱 engraving 惯例自绘。
 * quarter = 实心符头，half = 空心符头（乐句收尾的长音）；
 * eighth = 带符尾的装饰音符，只用于涟漪/跳音（参考 Kimi 卡片上漂浮的音符）。
 * fill/stroke 走 currentColor，由 CSS 控制配色。符干向下由外层
 * `.is-stem-down` 的 scaleY(-1) 完成；符杠连接由 StaffBeams 统一绘制。
 */
export function StaffGlyph({ kind }: { kind: 'quarter' | 'half' | 'eighth' }) {
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
