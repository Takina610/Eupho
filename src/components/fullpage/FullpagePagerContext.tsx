import { createContext, useContext, type ReactNode } from 'react'

type FullpagePagerContextValue = {
  activeIndex: number
  goTo: (index: number) => void
}

const FullpagePagerContext = createContext<FullpagePagerContextValue | null>(null)

export function FullpagePagerProvider({
  activeIndex,
  goTo,
  children,
}: FullpagePagerContextValue & { children: ReactNode }) {
  return (
    <FullpagePagerContext.Provider value={{ activeIndex, goTo }}>
      {children}
    </FullpagePagerContext.Provider>
  )
}

export function useFullpageGoTo() {
  return useFullpagePagerContext().goTo
}

export function useFullpageActiveIndex() {
  return useFullpagePagerContext().activeIndex
}

function useFullpagePagerContext() {
  const value = useContext(FullpagePagerContext)
  if (!value) {
    throw new Error('useFullpageGoTo must be used within FullpagePagerProvider')
  }
  return value
}
