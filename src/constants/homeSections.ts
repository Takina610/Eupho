import type { ComponentType } from 'react'
import { CtaSection } from '@/components/fullpage/sections/CtaSection'
import { IndexSection } from '@/components/fullpage/sections/IndexSection'
import { StackSection } from '@/components/fullpage/sections/StackSection'
import { InstrumentsSection } from '@/components/instruments/InstrumentsSection'

export type HomeSectionId = 'index' | 'stack' | 'instruments' | 'cta'

/** Sections may opt into knowing whether they are the currently visible page. */
export type SectionActiveProps = { active?: boolean }

export type HomeSectionConfig = {
  id: HomeSectionId
  Component: ComponentType<SectionActiveProps>
}

export const HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'index', Component: IndexSection },
  { id: 'stack', Component: StackSection },
  { id: 'instruments', Component: InstrumentsSection },
  { id: 'cta', Component: CtaSection },
]
