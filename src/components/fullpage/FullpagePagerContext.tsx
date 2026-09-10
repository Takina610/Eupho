import { createContext, useContext, type ReactNode } from 'react'

type FullpagePagerContextValue = {
  goTo: (index: number) => void
}

const FullpagePagerContext = createContext<FullpagePagerContextValue | null>(null)

export function FullpagePagerProvider({
  goTo,
  children,
}: FullpagePagerContextValue & { children: ReactNode }) {
  return <FullpagePagerContext.Provider value={{ goTo }}>{children}</FullpagePagerContext.Provider>
}

export function useFullpageGoTo() {
  const value = useContext(FullpagePagerContext)
  if (!value) {
    throw new Error('useFullpageGoTo must be used within FullpagePagerProvider')
  }
  return value.goTo
}
