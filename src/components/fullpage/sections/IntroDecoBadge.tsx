import { useId } from 'react'

import decoRotate from '@/assets/deco-rotate.png'

import './introDecoBadge.css'

/**
 * 「Sound! Euphonium」环形旋转徽章：文字沿圆弧匀速转动，中央上低音号图标保持正立。
 * 同一组件两处实例（变体样式见 introDecoBadge.css）：桌面端钉在 Introduction
 * 舞台右下角（.intro-deco--corner，绝对定位，需放在 .intro-inner 之外才能锚定舞台）；
 * 移动端排在 .intro-inner 文字下方居中（.intro-deco--panel）。
 * 「Sound!」「Euphonium」用两段 textPath 分开排布，接缝间隙才不会被
 * textLength 的均匀分配挤到和词距一样窄。
 */
export function IntroDecoBadge({ className = '' }: { className?: string }) {
  // useId 可能带出冒号等字符，SVG href 的片段标识符里只保留 id 安全字符
  const trackId = `intro-deco-track-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <div className={`intro-deco ${className}`.trim()} aria-hidden>
      <svg className="intro-deco-ring" viewBox="0 0 100 100">
        <defs>
          <path
            id={trackId}
            d="M 50 50 m -37.5 0 a 37.5 37.5 0 1 1 75 0 a 37.5 37.5 0 1 1 -75 0"
            fill="none"
          />
        </defs>
        <text>
          <textPath href={`#${trackId}`} textLength="88" lengthAdjust="spacing">
            Sound!
          </textPath>
          <textPath href={`#${trackId}`} startOffset="97" textLength="126" lengthAdjust="spacing">
            Euphonium
          </textPath>
        </text>
      </svg>
      <img src={decoRotate} alt="" className="intro-deco-icon" loading="lazy" />
    </div>
  )
}
