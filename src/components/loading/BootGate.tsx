import { useEffect, useState, type ReactNode } from 'react'
import logoUrl from '@/assets/re_logo.png'
import { useBootPreloader } from '@/hooks/useBootPreloader'
import { KatanaReveal } from '@/components/loading/KatanaReveal'
import { BootImpactShards } from '@/components/loading/BootImpactShards'

/**
 * 路由懒加载分块未就绪时的兜底画面：与加载层同色。
 * RouterProvider 匹配挂起时（defaultPendingComponent）和 Outlet 悬挂时都会用到，
 * 避免 React 清掉静态壳后露出深色 body。
 */
export function BootHold() {
  return <div className="boot-hold" aria-hidden="true" />
}

/**
 * 加载页内容：斜向大字站标 + 居中站标 + 底部进度 HUD + 角标。
 * 开屏加载层与居合斩揭幕的两块遮罩渲染同一份构图——
 * 遮罩合起来就是当前加载页，刀切下去时是页面本体被切开，内容随两半裂开。
 */
function BootScreen({ percent }: { percent: number }) {
  return (
    <>
      <p className="boot-wordmark" aria-hidden="true">
        <span>Sound!</span>
        <span>Euphonium</span>
      </p>
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
        <div className="boot-bar">
          <span className="boot-bar-line" aria-hidden="true" />
          <span className="boot-bar-fillwrap">
            <span className="boot-bar-fill" style={{ width: `${percent}%` }} />
          </span>
          <span className="boot-bar-cap boot-bar-cap--l" aria-hidden="true" />
          <span className="boot-bar-cap boot-bar-cap--r" aria-hidden="true" />
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
    </>
  )
}

/**
 * 开屏加载闸：预载期间盖住页面，完成后先挂载内容，
 * 再用居合斩（KatanaReveal）把加载页本体一刀切开露出首屏，
 * 让首屏入场动画正好在揭开时播放。静态壳在 index.html 里，
 * 两者共用 src/styles/bootLoader.css（由 index.html 的 link 引入）。
 * 构图参考 ak.hypergryph.com。
 */
export function BootGate({ children }: { children: ReactNode }) {
  const { progress, phase } = useBootPreloader()
  const [slash, setSlash] = useState(false)
  const [shards, setShards] = useState(false)
  const percent = Math.round(progress * 100)

  // 加载层开始淡出时叠上居合斩揭幕：两块遮罩带着加载页内容盖住全屏，
  // 视觉上就是当前页被一刀切开；同时挂上冲击碎片层（它自己等挥刀起手帧再播）。
  // 揭幕自己播完即卸载，不随 phase 提前消失
  useEffect(() => {
    if (phase === 'leaving') {
      setSlash(true)
      setShards(true)
    }
  }, [phase])

  // React 首次提交后静态壳（index.html 的 #boot-shell）就已完成使命：
  // 加载层已同帧铺上，此时移除，避免它留在 #root 之外挡住页面。
  useEffect(() => {
    document.getElementById('boot-shell')?.remove()
  }, [])

  return (
    <>
      {phase !== 'gone' && (
        <div className="boot-overlay" data-leaving={phase === 'leaving' ? '' : undefined}>
          <BootScreen percent={percent} />
        </div>
      )}
      {slash && (
        <KatanaReveal>
          <BootScreen percent={percent} />
        </KatanaReveal>
      )}
      {shards && <BootImpactShards />}
      {phase !== 'loading' && children}
    </>
  )
}
