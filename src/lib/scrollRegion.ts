import type Lenis from 'lenis'

/**
 * 屏内滚动区（data-fullpage-scroll）与其实例化的 Lenis 的关联表。
 * 输入门控据此区分「Lenis 托管」与「手动 scrollTop 兜底」两种滚动方式。
 */
const registry = new WeakMap<HTMLElement, Lenis>()

export function setScrollRegionLenis(region: HTMLElement, lenis: Lenis | null) {
  if (lenis) {
    registry.set(region, lenis)
  } else {
    registry.delete(region)
  }
}

export function getScrollRegionLenis(region: HTMLElement): Lenis | null {
  return registry.get(region) ?? null
}
