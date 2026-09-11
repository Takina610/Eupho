import type { CSSProperties, ReactNode } from 'react'

type SceneLayerProps = {
  children: ReactNode
  isLower: boolean
  isUpper: boolean
  isIdleActive: boolean
  isAriaCurrent: boolean
  clipPath?: string
  zIndex: number
}

export function SceneLayer({
  children,
  isLower,
  isUpper,
  isIdleActive,
  isAriaCurrent,
  clipPath,
  zIndex,
}: SceneLayerProps) {
  const visible = isIdleActive || isLower || isUpper
  const style: CSSProperties = {
    zIndex,
    clipPath: isIdleActive ? 'inset(0 0% 0 0)' : (clipPath ?? 'inset(0 100% 0 0)'),
    willChange: 'clip-path',
  }

  return (
    <div
      aria-hidden={!isAriaCurrent}
      className={`absolute inset-0 ${isIdleActive ? '' : 'pointer-events-none'}`.trim()}
      data-active={visible ? 'true' : 'false'}
      style={style}
    >
      {children}
    </div>
  )
}
