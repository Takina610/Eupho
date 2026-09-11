import type { ComponentType } from 'react'
import { CtaSection } from '@/components/fullpage/sections/CtaSection'
import { IndexSection } from '@/components/fullpage/sections/IndexSection'
import { ShowcaseSection } from '@/components/fullpage/sections/ShowcaseSection'
import { StackSection } from '@/components/fullpage/sections/StackSection'

export type HomeSectionId = 'index' | 'stack' | 'showcase' | 'cta'

export type HomeSectionConfig = {
  id: HomeSectionId
  Component: ComponentType
}

export const HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'index', Component: IndexSection },
  { id: 'stack', Component: StackSection },
  { id: 'showcase', Component: ShowcaseSection },
  { id: 'cta', Component: CtaSection },
]
