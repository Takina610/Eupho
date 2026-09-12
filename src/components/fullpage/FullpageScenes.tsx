import type { ComponentType } from 'react'
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
}

export function FullpageScenes({ sections, from, to }: FullpageScenesProps) {
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
            isLower={role.isLower}
            isUpper={role.isUpper}
            zIndex={role.isUpper ? 1 : 0}
          >
            <Component {...(usesActive ? { active: index === to } : {})} />
          </SceneLayer>
        )
      })}
    </>
  )
}
