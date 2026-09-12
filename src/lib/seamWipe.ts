import { easeInOutQuad } from '@/lib/easing'

export type SeamWipeInput = {
  from: number
  to: number
}

export function getSeamBounds(from: number, to: number) {
  return {
    lower: Math.min(from, to),
    upper: Math.max(from, to),
    forward: to > from,
  }
}

/**
 * Eased seam progress for a wipe at raw time t (0→1): 1 = lower layer fully visible,
 * 0 = upper layer fully visible. Written per frame into `--seam-p` by the wipe loop.
 */
export function seamProgressAt(rawT: number, from: number, to: number) {
  const progress = easeInOutQuad(rawT)
  return to > from ? 1 - progress : progress
}

/**
 * clip-path strings are static per wipe and derive from the animated `--seam-p`
 * custom property, so the wipe never needs per-frame React state.
 */
export function getSeamLayerStyle(index: number, input: SeamWipeInput): SeamLayerStyle | null {
  const { from, to } = input
  if (from === to) {
    return null
  }

  const { lower, upper } = getSeamBounds(from, to)

  if (index === lower) {
    return { clipPath: 'inset(0 calc((1 - var(--seam-p)) * 100%) 0 0)' }
  }

  if (index === upper) {
    return { clipPath: 'inset(0 0 0 calc(var(--seam-p) * 100%))' }
  }

  return null
}

export function getSeamLayerRole(index: number, from: number, to: number) {
  const animating = from !== to
  const { lower, upper } = getSeamBounds(from, to)
  return {
    isIdleActive: !animating && index === to,
    isLower: animating && index === lower,
    isUpper: animating && index === upper,
  }
}

export type SeamLayerStyle = {
  clipPath: string
}
