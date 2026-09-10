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
      className={`flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 pt-[152px] pr-[237px] pb-16 ${className}`.trim()}
    >
      {children}
    </section>
  )
}
