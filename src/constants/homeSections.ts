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
  // index 不接收 active：详情的离页自收由 SeriesDetailStage 订阅 activeIndex 完成，
  // 这样最重的首页（手风琴 + 谱面）在切页状态翻转时完全不重渲染。
  { id: 'index', Component: IndexSection },
  { id: 'members', Component: MembersSection },
  { id: 'instruments', Component: InstrumentsSection, usesActive: true },
  { id: 'introduction', Component: IntroductionSection, usesActive: true },
]

/** 全局菜单的条目：顺序与 HOME_SECTIONS 对齐，EN 为主标签（AK 官网导航的双行样式）。 */
export type MenuItemConfig = { id: HomeSectionId; en: string; zh: string }

export const MENU_ITEMS: MenuItemConfig[] = [
  { id: 'index', en: 'INDEX', zh: '首页' },
  { id: 'members', en: 'MEMBERS', zh: '部员' },
  { id: 'instruments', en: 'INSTRUMENTS', zh: '乐器' },
  { id: 'introduction', en: 'INTRODUCTION', zh: '作品介绍' },
]
