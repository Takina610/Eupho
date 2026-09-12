import type { ReactNode } from 'react'
import logoUrl from '@/assets/eupho.webp'
import { useBootPreloader } from '@/hooks/useBootPreloader'

/**
 * 开屏加载闸：预载期间盖住页面，完成后先挂载内容再淡出加载层，
 * 让首屏入场动画正好在揭开时播放。静态壳在 index.html 里，
 * 两者共用 src/styles/bootLoader.css（由 index.html 的 link 引入）。
 */
export function BootGate({ children }: { children: ReactNode }) {
  const { progress, phase } = useBootPreloader()
  const percent = Math.round(progress * 100)

  return (
    <>
      {phase !== 'gone' && (
        <div
          className="boot-overlay"
          data-leaving={phase === 'leaving' ? '' : undefined}
          role="progressbar"
          aria-label="页面资源加载中"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <img className="boot-logo" src={logoUrl} alt="" draggable={false} />
          <p className="boot-caption">NOW LOADING</p>
          <div className="boot-bar">
            <span className="boot-bar-fill" style={{ width: `${percent}%` }} />
          </div>
          <p className="boot-count">{percent}%</p>
        </div>
      )}
      {phase !== 'loading' && children}
    </>
  )
}
