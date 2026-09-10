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
      className={`safe-pad flex h-full w-full flex-col items-center justify-center overflow-hidden ${className}`.trim()}
    >
      {children}
    </section>
  )
}
