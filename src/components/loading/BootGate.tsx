import type { ReactNode } from 'react'
import logoUrl from '@/assets/re_logo.png'
import fclefUrl from '@/assets/re_fclef.png'
import { useBootPreloader } from '@/hooks/useBootPreloader'

/**
 * 开屏加载闸：预载期间盖住页面，完成后先挂载内容再淡出加载层，
 * 让首屏入场动画正好在揭开时播放。静态壳在 index.html 里，
 * 两者共用 src/styles/bootLoader.css（由 index.html 的 link 引入）。
 * 构图参考 ak.hypergryph.com：左上中站标 + 底部五线谱进度条与状态行。
 */
export function BootGate({ children }: { children: ReactNode }) {
  const { progress, phase } = useBootPreloader()
  const percent = Math.round(progress * 100)

  return (
    <>
      {phase !== 'gone' && (
        <div className="boot-overlay" data-leaving={phase === 'leaving' ? '' : undefined}>
          <div className="boot-brand">
            <img className="boot-logo" src={logoUrl} alt="吹响吧！上低音号" draggable={false} />
          </div>
          <div
            className="boot-hud"
            role="progressbar"
            aria-label="页面资源加载中"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div className="boot-staff">
              <span className="boot-staff-clip">
                <span className="boot-staff-fill" style={{ width: `${percent}%` }} />
              </span>
              <span className="boot-staff-lines" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <img className="boot-clef" src={fclefUrl} alt="" draggable={false} />
            </div>
            <div className="boot-meta">
              <p className="boot-loading">
                <i className="boot-caret" aria-hidden="true" />
                LOADING - <span className="boot-count">{percent}</span>%
                <span className="boot-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </p>
              <p className="boot-site">吹响吧！上低音号 // FAN SITE</p>
            </div>
          </div>
          <p className="boot-corner">© SOUND! EUPHONIUM</p>
        </div>
      )}
      {phase !== 'loading' && children}
    </>
  )
}
