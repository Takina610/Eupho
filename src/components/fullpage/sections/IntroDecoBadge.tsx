import decoRotate from '@/assets/deco-rotate.png'

/**
 * Introduction 右下角的旋转徽章：环形文字「Sound! Euphonium」
 * 绕中央上低音号图标匀速转动（图标保持正立，仅文字环旋转）。
 * 桌面端固定在舞台右下角；移动端随内容排在面板下方。
 */
export function IntroDecoBadge() {
  return (
    <div className="intro-deco" aria-hidden>
      {/* 圆弧半径 37.5 → 周长约 235.6，textLength 拉满让字符均匀铺满整圈 */}
      <svg className="intro-deco-ring" viewBox="0 0 100 100">
        <defs>
          <path
            id="intro-deco-track"
            d="M 50 50 m -37.5 0 a 37.5 37.5 0 1 1 75 0 a 37.5 37.5 0 1 1 -75 0"
            fill="none"
          />
        </defs>
        <text>
          <textPath href="#intro-deco-track" textLength="235" lengthAdjust="spacing">
            Sound! Euphonium
          </textPath>
        </text>
      </svg>
      <img src={decoRotate} alt="" className="intro-deco-icon" loading="lazy" />
    </div>
  )
}
