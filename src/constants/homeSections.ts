import type { ComponentType } from 'react'
import { CtaSection } from '@/components/fullpage/sections/CtaSection'
import { HeroSection } from '@/components/fullpage/sections/HeroSection'
import { ShowcaseSection } from '@/components/fullpage/sections/ShowcaseSection'
import { StackSection } from '@/components/fullpage/sections/StackSection'

export type HomeSectionId = 'hero' | 'stack' | 'showcase' | 'cta'

export type HomeSectionConfig = {
  id: HomeSectionId
  label: string
  code: string
  Component: ComponentType
}

export const HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'hero', label: '首页', code: 'HOME', Component: HeroSection },
  { id: 'stack', label: '技术栈', code: 'STACK', Component: StackSection },
  { id: 'showcase', label: '展示', code: 'SHOW', Component: ShowcaseSection },
  { id: 'cta', label: '开始', code: 'START', Component: CtaSection },
]
