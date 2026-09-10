export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) ** 2
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

export const EASE_IN_OUT_QUAD_CSS = 'cubic-bezier(0.45, 0, 0.55, 1)'
export const EASE_OUT_QUAD_CSS = 'cubic-bezier(0.5, 1, 0.89, 1)'
export const EASE_OUT_CUBIC_CSS = 'cubic-bezier(0.33, 1, 0.68, 1)'
