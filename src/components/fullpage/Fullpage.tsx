import { useRef, type CSSProperties } from 'react'
import { ENTER_MS, ENTER_OFFSET, ENTER_STAGGER_MS, FOOTER_MS } from '@/constants/fullpageMotion'
import { HOME_SECTIONS } from '@/constants/homeSections'
import { FullpageFooter } from '@/components/fullpage/FullpageFooter'
import { FullpagePagerProvider } from '@/components/fullpage/FullpagePagerContext'
import { FullpageScenes } from '@/components/fullpage/FullpageScenes'
import { useElementHeight } from '@/hooks/useElementHeight'
import { useFullpagePager } from '@/hooks/useFullpagePager'
import { EASE_OUT_QUAD_CSS } from '@/lib/easing'

export function Fullpage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const footerHeight = useElementHeight(footerRef)
  const pager = useFullpagePager({ pageCount: HOME_SECTIONS.length, targetRef: rootRef })

  return (
    <FullpagePagerProvider goTo={pager.goTo} setOverlayLock={pager.setOverlayLock}>
      <div ref={rootRef} className="h-dvh overflow-hidden">
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
            className="relative h-dvh overflow-hidden touch-none"
            style={
              {
                '--enter-offset': ENTER_OFFSET,
                '--enter-ms': `${ENTER_MS}ms`,
                '--enter-stagger': `${ENTER_STAGGER_MS}ms`,
              } as CSSProperties
            }
          >
            <FullpageScenes
              from={pager.from}
              progress={pager.progress}
              rawT={pager.rawT}
              sections={HOME_SECTIONS}
              to={pager.to}
            />
          </div>
          <FullpageFooter ref={footerRef} />
        </div>
      </div>
    </FullpagePagerProvider>
  )
}
