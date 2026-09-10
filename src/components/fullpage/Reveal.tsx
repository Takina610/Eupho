import type { CSSProperties, ReactNode } from 'react'

type RevealProps = {
  index: number
  children: ReactNode
  className?: string
}

export function Reveal({ index, children, className = '' }: RevealProps) {
  const style = { '--i': String(index) } as CSSProperties

  return (
    <div className={`reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}
