import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  children: ReactNode
  className?: string
}

export function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      data-fullpage-section
      className={`flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 ${className}`.trim()}
    >
      {children}
    </section>
  )
}
