import { useEffect } from 'react'
import { HOME_SECTIONS } from '@/constants/homeSections'

export type GoToOptions = {
  interrupt?: boolean
  fromHash?: boolean
}

export function getIndexFromHash(): number {
  if (typeof window === 'undefined') {
    return 0
  }

  const id = window.location.hash.replace(/^#/, '')
  const index = HOME_SECTIONS.findIndex((section) => section.id === id)
  return index >= 0 ? index : 0
}

export function pushSectionHash(index: number) {
  const id = HOME_SECTIONS[index]?.id
  if (!id) {
    return
  }

  const nextHash = `#${id}`
  if (window.location.hash === nextHash) {
    return
  }

  window.history.pushState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`)
}

export function useFullpageHash(goTo: (index: number, options?: GoToOptions) => void) {
  useEffect(() => {
    const onChange = () => {
      goTo(getIndexFromHash(), { interrupt: true, fromHash: true })
    }

    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
    }
  }, [goTo])
}
