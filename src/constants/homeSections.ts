import type { ComponentType } from 'react'
import { IndexSection } from '@/components/fullpage/sections/IndexSection'
import { IntroductionSection } from '@/components/fullpage/sections/IntroductionSection'
import { MembersSection } from '@/components/fullpage/sections/MembersSection'
import { InstrumentsSection } from '@/components/instruments/InstrumentsSection'

export type HomeSectionId = 'index' | 'members' | 'instruments' | 'introduction'

/** Sections may opt into knowing whether they are the currently visible page. */
export type SectionActiveProps = { active?: boolean }

export type HomeSectionConfig = {
  id: HomeSectionId
  Component: ComponentType<SectionActiveProps>
  /**
   * Only sections that actually react to `active` should receive it: flipping the prop
   * would otherwise re-render (heavy) sections at every wipe start/end even though
   * their output does not depend on it.
   */
  usesActive?: boolean
}

export const HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'index', Component: IndexSection },
  { id: 'members', Component: MembersSection },
  { id: 'instruments', Component: InstrumentsSection, usesActive: true },
  { id: 'introduction', Component: IntroductionSection, usesActive: true },
]
