import { useEffect } from 'react'
import { HOME_SECTIONS, type HomeSectionId } from '@/constants/homeSections'

const SECTION_ID_ALIASES: Record<string, HomeSectionId> = {
  hero: 'index',
  // Old section name before the members rename.
  stack: 'members',
  // Old section name before the introduction rename.
  cta: 'introduction',
  showcase: 'instruments',
}

export type GoToOptions = {
  interrupt?: boolean
  fromHash?: boolean
}

function readHashId(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const raw = window.location.hash.replace(/^#/, '')
  return SECTION_ID_ALIASES[raw] ?? raw
}

export function getIndexFromHash(): number {
  const id = readHashId()
  const index = HOME_SECTIONS.findIndex((section) => section.id === id)
  return index >= 0 ? index : 0
}

function writeSectionHash(index: number, mode: 'push' | 'replace') {
  const id = HOME_SECTIONS[index]?.id
  if (!id) {
    return
  }

  const nextHash = `#${id}`
  if (window.location.hash === nextHash) {
    return
  }

  const url = `${window.location.pathname}${window.location.search}${nextHash}`
  if (mode === 'replace') {
    window.history.replaceState(null, '', url)
    return
  }

  window.history.pushState(null, '', url)
}

export function pushSectionHash(index: number) {
  writeSectionHash(index, 'push')
}

export function useFullpageHash(goTo: (index: number, options?: GoToOptions) => void) {
  useEffect(() => {
    writeSectionHash(getIndexFromHash(), 'replace')

    const onChange = () => {
      const index = getIndexFromHash()
      writeSectionHash(index, 'replace')
      goTo(index, { interrupt: true, fromHash: true })
    }

    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
    }
  }, [goTo])
}
