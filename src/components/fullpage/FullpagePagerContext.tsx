import { createContext, useContext, type ReactNode } from 'react'

type FullpagePagerContextValue = {
  goTo: (index: number) => void
  setOverlayLock: (locked: boolean) => void
}

const FullpagePagerContext = createContext<FullpagePagerContextValue | null>(null)

export function FullpagePagerProvider({
  goTo,
  setOverlayLock,
  children,
}: FullpagePagerContextValue & { children: ReactNode }) {
  return <FullpagePagerContext.Provider value={{ goTo, setOverlayLock }}>{children}</FullpagePagerContext.Provider>
}

function useFullpagePagerContext() {
  const value = useContext(FullpagePagerContext)
  if (!value) {
    throw new Error('Fullpage pager hooks must be used within FullpagePagerProvider')
  }
  return value
}

export function useFullpageGoTo() {
  return useFullpagePagerContext().goTo
}

export function useFullpageOverlayLock() {
  return useFullpagePagerContext().setOverlayLock
}
