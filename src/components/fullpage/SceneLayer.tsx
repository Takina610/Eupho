import type { CSSProperties, ReactNode } from 'react'

type SceneLayerProps = {
  children: ReactNode
  isLower: boolean
  isUpper: boolean
  isIdleActive: boolean
  isAriaCurrent: boolean
  clipPath?: string
  opacity?: number
  zIndex: number
  animating: boolean
}

export function SceneLayer({
  children,
  isLower,
  isUpper,
  isIdleActive,
  isAriaCurrent,
  clipPath,
  opacity,
  zIndex,
  animating,
}: SceneLayerProps) {
  const visible = isIdleActive || isLower || isUpper
  const style: CSSProperties = {
    zIndex,
    opacity: isIdleActive ? 1 : opacity,
    clipPath: isIdleActive ? 'none' : clipPath,
    willChange: animating && visible ? 'clip-path, opacity' : undefined,
  }

  return (
    <div
      aria-hidden={!isAriaCurrent}
      className={`absolute inset-0 ${isIdleActive ? '' : 'pointer-events-none'} ${visible ? '' : 'invisible'}`.trim()}
      data-active={visible ? 'true' : 'false'}
      style={style}
    >
      {children}
    </div>
  )
}
