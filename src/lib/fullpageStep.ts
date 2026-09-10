export type FullpageIntent =
  | { type: 'page'; index: number }
  | { type: 'footer'; revealed: boolean }
  | { type: 'none' }

export function resolveFullpageIntent({
  current,
  lastIndex,
  delta,
  footerRevealed,
}: {
  current: number
  lastIndex: number
  delta: 1 | -1
  footerRevealed: boolean
}): FullpageIntent {
  if (footerRevealed) {
    return delta < 0 ? { type: 'footer', revealed: false } : { type: 'none' }
  }

  const next = current + delta
  if (next > lastIndex) {
    return { type: 'footer', revealed: true }
  }

  if (next < 0) {
    return { type: 'none' }
  }

  return { type: 'page', index: next }
}
