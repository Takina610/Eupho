import { HOME_SECTIONS } from '@/constants/homeSections'
import { FullpagePagerProvider } from '@/components/fullpage/FullpagePagerContext'
import { SceneLayer } from '@/components/fullpage/SceneLayer'
import { useFullpagePager } from '@/hooks/useFullpagePager'

export function Fullpage() {
  const { activeIndex, direction, goTo, leavingIndex, settled, transitionMs } = useFullpagePager({
    pageCount: HOME_SECTIONS.length,
  })

  return (
    <FullpagePagerProvider goTo={goTo}>
      <div className="relative h-dvh overflow-hidden">
        {HOME_SECTIONS.map(({ id, Component }, index) => {
          const isActive = index === activeIndex
          const isLeaving = index === leavingIndex
          return (
            <SceneLayer
              key={id}
              direction={direction}
              isActive={isActive}
              isLeaving={isLeaving}
              settled={settled}
              transitionMs={transitionMs}
              zIndex={isActive ? 2 : isLeaving ? 1 : 0}
            >
              <Component />
            </SceneLayer>
          )
        })}
      </div>
    </FullpagePagerProvider>
  )
}
