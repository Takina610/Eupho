import { createContext, useContext, type ReactNode } from 'react'

type FullpagePagerContextValue = {
  activeIndex: number
  goTo: (index: number) => void
  /** 按 key 声明浮层锁：同一 key 重复声明幂等，全部 key 释放后才恢复翻页。 */
  setOverlayLock: (key: string, locked: boolean) => void
}

const FullpagePagerContext = createContext<FullpagePagerContextValue | null>(null)

export function FullpagePagerProvider({
  activeIndex,
  goTo,
  setOverlayLock,
  children,
}: FullpagePagerContextValue & { children: ReactNode }) {
  return (
    <FullpagePagerContext.Provider value={{ activeIndex, goTo, setOverlayLock }}>
      {children}
    </FullpagePagerContext.Provider>
  )
}

function useFullpagePagerContext() {
  const value = useContext(FullpagePagerContext)
  if (!value) {
    throw new Error('Fullpage pager hooks must be used within FullpagePagerProvider')
  }
  return value
}

export function useFullpageActiveIndex() {
  return useFullpagePagerContext().activeIndex
}

export function useFullpageGoTo() {
  return useFullpagePagerContext().goTo
}

export function useFullpageOverlayLock() {
  return useFullpagePagerContext().setOverlayLock
}
