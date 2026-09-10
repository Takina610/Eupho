import type { ComponentType } from 'react'
import { SceneLayer } from '@/components/fullpage/SceneLayer'
import { getSeamLayerRole, getSeamLayerStyle } from '@/lib/seamWipe'

type SceneConfig = {
  id: string
  Component: ComponentType
}

type FullpageScenesProps = {
  sections: readonly SceneConfig[]
  from: number
  to: number
  progress: number
  rawT: number
}

export function FullpageScenes({ sections, from, to, progress, rawT }: FullpageScenesProps) {
  return (
    <>
      {sections.map(({ id, Component }, index) => {
        const role = getSeamLayerRole(index, from, to)
        const style = getSeamLayerStyle(index, { from, to, progress, rawT })
        return (
          <SceneLayer
            key={id}
            clipPath={style?.clipPath}
            isIdleActive={role.isIdleActive}
            isAriaCurrent={index === to}
            isLower={role.isLower}
            isUpper={role.isUpper}
            opacity={style?.opacity}
            zIndex={role.isUpper ? 1 : 0}
          >
            <Component />
          </SceneLayer>
        )
      })}
    </>
  )
}
