import { useRef, type CSSProperties } from 'react'
import { ENTER_MS, ENTER_OFFSET, ENTER_STAGGER_MS, FOOTER_MS } from '@/constants/fullpageMotion'
import { HOME_SECTIONS } from '@/constants/homeSections'
import { FullpageFooter } from '@/components/fullpage/FullpageFooter'
import { FullpagePagerProvider } from '@/components/fullpage/FullpagePagerContext'
import { FullpageScenes } from '@/components/fullpage/FullpageScenes'
import { PageCounter } from '@/components/fullpage/PageCounter'
import { ScrollHint } from '@/components/fullpage/ScrollHint'
import { SeamParticles } from '@/components/fullpage/SeamParticles'
import { StageGrid } from '@/components/fullpage/StageGrid'
import { StageHeader } from '@/components/fullpage/StageHeader'
import { useElementHeight } from '@/hooks/useElementHeight'
import { useFullpagePager } from '@/hooks/useFullpagePager'
import { EASE_OUT_QUAD_CSS } from '@/lib/easing'
import { getSeamBounds, seamProgressToP } from '@/lib/seamWipe'

export function Fullpage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const footerHeight = useElementHeight(footerRef)
  const pager = useFullpagePager({ pageCount: HOME_SECTIONS.length, targetRef: rootRef })
  const { forward } = getSeamBounds(pager.from, pager.to)
  const p = seamProgressToP(pager.progress, forward)
  const wiping = pager.from !== pager.to

  return (
    <FullpagePagerProvider activeIndex={pager.activeIndex} goTo={pager.goTo}>
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
            <SeamParticles active={wiping && !pager.reducedMotion} p={p} />
            <StageGrid />
            <ScrollHint isLast={pager.activeIndex === HOME_SECTIONS.length - 1} />
            <PageCounter direction={pager.direction} index={pager.activeIndex} />
            <StageHeader />
          </div>
          <FullpageFooter ref={footerRef} />
        </div>
      </div>
    </FullpagePagerProvider>
  )
}
