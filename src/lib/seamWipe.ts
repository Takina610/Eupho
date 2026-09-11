export type SeamWipeInput = {
  from: number
  to: number
  progress: number
  rawT: number
}

export type SeamLayerStyle = {
  clipPath: string
}

export function getSeamBounds(from: number, to: number) {
  return {
    lower: Math.min(from, to),
    upper: Math.max(from, to),
    forward: to > from,
  }
}

export function seamProgressToP(progress: number, forward: boolean) {
  return forward ? 1 - progress : progress
}

export function lowerClipPath(p: number) {
  return `inset(0 ${(1 - p) * 100}% 0 0)`
}

export function upperClipPath(p: number) {
  return `inset(0 0 0 ${p * 100}%)`
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

export function getSeamLayerStyle(index: number, input: SeamWipeInput): SeamLayerStyle | null {
  const { from, to, progress } = input
  if (from === to) {
    return null
  }

  const { lower, upper, forward } = getSeamBounds(from, to)
  const p = seamProgressToP(progress, forward)

  if (index === lower) {
    return { clipPath: lowerClipPath(p) }
  }

  if (index === upper) {
    return { clipPath: upperClipPath(p) }
  }

  return null
}
