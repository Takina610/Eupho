import { useEffect, type CSSProperties, type ReactNode } from 'react'
import logoUrl from '@/assets/re_logo.png'
import fclefUrl from '@/assets/re_fclef.png'
import { useBootPreloader } from '@/hooks/useBootPreloader'

/** 各谱线起始端的阶梯错位（从上到下依次变短，右端对齐），差距刻意很小。 */
const LINE_STARTS = ['0px', '12px', '24px', '36px', '48px'] as const

/**
 * 路由懒加载分块未就绪时的兜底画面：与加载层同色。
 * RouterProvider 匹配挂起时（defaultPendingComponent）和 Outlet 悬挂时都会用到，
 * 避免 React 清掉静态壳后露出深色 body。
 */
export function BootHold() {
  return <div className="boot-hold" aria-hidden="true" />
}

/**
 * 开屏加载闸：预载期间盖住页面，完成后先挂载内容再淡出加载层，
 * 让首屏入场动画正好在揭开时播放。静态壳在 index.html 里，
 * 两者共用 src/styles/bootLoader.css（由 index.html 的 link 引入）。
 * 构图参考 ak.hypergryph.com：居中站标 + 底部五线谱进度与状态行。
 */
export function BootGate({ children }: { children: ReactNode }) {
  const { progress, phase } = useBootPreloader()
  const percent = Math.round(progress * 100)

  // React 首次提交后静态壳（index.html 的 #boot-shell）就已完成使命：
  // 加载层已同帧铺上，此时移除，避免它留在 #root 之外挡住页面。
  useEffect(() => {
    document.getElementById('boot-shell')?.remove()
  }, [])

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
              <span className="boot-staff-lines" aria-hidden="true">
                {LINE_STARTS.map((start) => (
                  <i className="boot-line" key={start} style={{ '--start': start } as CSSProperties}>
                    <span className="boot-line-bar" style={{ width: `${percent}%` }} />
                  </i>
                ))}
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
