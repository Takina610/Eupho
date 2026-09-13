import { createContext, useContext, type ReactNode } from 'react'

type FullpagePagerContextValue = {
  activeIndex: number
  goTo: (index: number) => void
  /** 按 key 声明浮层锁：同一 key 重复声明幂等，全部 key 释放后才恢复翻页。 */
  setOverlayLock: (key: string, locked: boolean) => void
  /** 当前占用浮层锁的 key 集合（响应式），供菜单等按需显隐自身。 */
  overlayLockKeys: ReadonlySet<string>
}

const FullpagePagerContext = createContext<FullpagePagerContextValue | null>(null)

export function FullpagePagerProvider({
  activeIndex,
  goTo,
  setOverlayLock,
  overlayLockKeys,
  children,
}: FullpagePagerContextValue & { children: ReactNode }) {
  return (
    <FullpagePagerContext.Provider value={{ activeIndex, goTo, setOverlayLock, overlayLockKeys }}>
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

export function useFullpageOverlayLockKeys() {
  return useFullpagePagerContext().overlayLockKeys
}

export function useFullpageGoTo() {
  return useFullpagePagerContext().goTo
}

export function useFullpageOverlayLock() {
  return useFullpagePagerContext().setOverlayLock
}
