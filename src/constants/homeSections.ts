import type { ComponentType } from 'react'
import { CtaSection } from '@/components/fullpage/sections/CtaSection'
import { IndexSection } from '@/components/fullpage/sections/IndexSection'
import { MembersSection } from '@/components/fullpage/sections/MembersSection'
import { InstrumentsSection } from '@/components/instruments/InstrumentsSection'

export type HomeSectionId = 'index' | 'members' | 'instruments' | 'cta'

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
  { id: 'cta', Component: CtaSection, usesActive: true },
]
