import type { ComponentType, RefObject } from 'react'
import { SceneLayer } from '@/components/fullpage/SceneLayer'
import type { SectionActiveProps } from '@/constants/homeSections'
import { getSeamLayerRole, getSeamLayerStyle } from '@/lib/seamWipe'

type SceneConfig = {
  id: string
  Component: ComponentType<SectionActiveProps>
  usesActive?: boolean
}

type FullpageScenesProps = {
  sections: readonly SceneConfig[]
  from: number
  to: number
  /** Registered so the wipe loop can drive layer clip-paths outside React. */
  layerRefs: RefObject<Map<number, HTMLDivElement | null>>
}

export function FullpageScenes({ sections, from, to, layerRefs }: FullpageScenesProps) {
  // Forward wipes sweep the seam right-to-left, backward wipes the other way.
  // Layers expose the direction as a CSS variable so section CSS can sync its
  // reveal delays and leaving-motion with the seam (see app.css).
  const wipeForward = to > from
  return (
    <>
      {sections.map(({ id, Component, usesActive }, index) => {
        const role = getSeamLayerRole(index, from, to)
        const style = getSeamLayerStyle(index, { from, to })
        return (
          <SceneLayer
            key={id}
            clipPath={style?.clipPath}
            isIdleActive={role.isIdleActive}
            isAriaCurrent={index === to}
            isLeaving={role.isLeaving}
            isLower={role.isLower}
            isUpper={role.isUpper}
            layerRef={(el) => {
              if (el) {
                layerRefs.current?.set(index, el)
              } else {
                layerRefs.current?.delete(index)
              }
            }}
            wipeForward={wipeForward}
            zIndex={role.isUpper ? 1 : 0}
          >
            <Component {...(usesActive ? { active: index === to } : {})} />
          </SceneLayer>
        )
      })}
    </>
  )
}
