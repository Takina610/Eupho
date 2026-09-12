import type { CSSProperties, ReactNode } from 'react'

type SceneLayerProps = {
  children: ReactNode
  isLower: boolean
  isUpper: boolean
  isIdleActive: boolean
  isLeaving: boolean
  isAriaCurrent: boolean
  wipeForward: boolean
  clipPath?: string
  zIndex: number
}

export function SceneLayer({
  children,
  isLower,
  isUpper,
  isIdleActive,
  isLeaving,
  isAriaCurrent,
  wipeForward,
  clipPath,
  zIndex,
}: SceneLayerProps) {
  const visible = isIdleActive || isLower || isUpper
  const style: CSSProperties = {
    zIndex,
    clipPath: isIdleActive ? 'inset(0 0% 0 0)' : (clipPath ?? 'inset(0 100% 0 0)'),
    willChange: 'clip-path',
    // 1 = the seam sweeps right-to-left (forward), 0 = left-to-right.
    '--wipe-forward': wipeForward ? 1 : 0,
  } as CSSProperties

  return (
    <div
      aria-hidden={!isAriaCurrent}
      className={`absolute inset-0 ${isIdleActive ? '' : 'pointer-events-none'}`.trim()}
      data-active={visible ? 'true' : 'false'}
      data-leaving={isLeaving ? (wipeForward ? 'forward' : 'backward') : 'false'}
      style={style}
    >
      {children}
    </div>
  )
}
