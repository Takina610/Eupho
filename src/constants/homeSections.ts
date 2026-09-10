import type { ComponentType } from 'react'
import { CtaSection } from '@/components/fullpage/sections/CtaSection'
import { HeroSection } from '@/components/fullpage/sections/HeroSection'
import { ShowcaseSection } from '@/components/fullpage/sections/ShowcaseSection'
import { StackSection } from '@/components/fullpage/sections/StackSection'

export type HomeSectionId = 'hero' | 'stack' | 'showcase' | 'cta'

export type HomeSectionConfig = {
  id: HomeSectionId
  Component: ComponentType
}

export const HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'hero', Component: HeroSection },
  { id: 'stack', Component: StackSection },
  { id: 'showcase', Component: ShowcaseSection },
  { id: 'cta', Component: CtaSection },
]
