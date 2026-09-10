import { type ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'
import { prefersReducedMotion } from '@/lib/motion'

type LenisProviderProps = {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  if (prefersReducedMotion()) {
    return children
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
