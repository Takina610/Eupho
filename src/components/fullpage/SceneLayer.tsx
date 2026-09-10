import type { CSSProperties, ReactNode } from 'react'

type SceneLayerProps = {
  children: ReactNode
  direction: 1 | -1
  isActive: boolean
  isLeaving: boolean
  settled: boolean
  transitionMs: number
  zIndex: number
}

function offset(direction: 1 | -1, toward: 'in' | 'out') {
  const sign = toward === 'in' ? direction : -direction
  return `${sign * 100}%`
}

export function SceneLayer({
  children,
  direction,
  isActive,
  isLeaving,
  settled,
  transitionMs,
  zIndex,
}: SceneLayerProps) {
  let translate = '0%'
  if (isActive) {
    translate = !settled ? offset(direction, 'in') : '0%'
  } else if (isLeaving) {
    translate = settled ? offset(direction, 'out') : '0%'
  } else {
    translate = '100%'
  }

  const visible = isActive || isLeaving
  const style: CSSProperties = {
    transform: `translateY(${translate})`,
    transition:
      visible && settled ? `transform ${transitionMs}ms cubic-bezier(0.77, 0, 0.18, 1)` : 'none',
    zIndex,
  }

  return (
    <div
      aria-hidden={!isActive}
      className={`absolute inset-0 ${isActive ? '' : 'pointer-events-none'} ${visible ? '' : 'invisible'}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
