import { useRef, type CSSProperties } from 'react'
import { ENTER_MS, ENTER_OFFSET, ENTER_STAGGER_MS, FOOTER_MS } from '@/constants/fullpageMotion'
import { HOME_SECTIONS } from '@/constants/homeSections'
import { FullpageFooter } from '@/components/fullpage/FullpageFooter'
import { FullpagePagerProvider } from '@/components/fullpage/FullpagePagerContext'
import { FullpageScenes } from '@/components/fullpage/FullpageScenes'
import { GlobalMenu } from '@/components/menu/GlobalMenu'
import { useElementHeight } from '@/hooks/useElementHeight'
import { useFullpagePager } from '@/hooks/useFullpagePager'
import { EASE_OUT_QUAD_CSS } from '@/lib/easing'

export function Fullpage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const scenesRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const footerHeight = useElementHeight(footerRef)
  const pager = useFullpagePager({
    pageCount: HOME_SECTIONS.length,
    targetRef: rootRef,
    surfaceRef: scenesRef,
  })

  return (
    <FullpagePagerProvider goTo={pager.goTo} setOverlayLock={pager.setOverlayLock} activeIndex={pager.activeIndex}>
      <div ref={rootRef} className="h-dvh overflow-clip">
        <div
          className="fullpage-shell"
          style={{
            transform: `translateY(${pager.footerRevealed ? -footerHeight : 0}px)`,
            transition:
              pager.reducedMotion || !pager.footerLock
                ? 'none'
                : `transform ${FOOTER_MS}ms ${EASE_OUT_QUAD_CSS}`,
          }}
        >
          <div
            ref={scenesRef}
            className="relative h-dvh overflow-clip touch-none"
            style={
              {
                '--enter-offset': ENTER_OFFSET,
                '--enter-ms': `${ENTER_MS}ms`,
                '--enter-stagger': `${ENTER_STAGGER_MS}ms`,
              } as CSSProperties
            }
          >
            <FullpageScenes from={pager.from} sections={HOME_SECTIONS} to={pager.to} />
          </div>
          <FullpageFooter ref={footerRef} />
        </div>
        {/* 全局菜单在 shell 之外：不随谱线切页位移，遮罩能盖住整个页面 */}
        <GlobalMenu />
      </div>
    </FullpagePagerProvider>
  )
}
