/**
 * 居合斩揭幕信号。KatanaReveal 在刀起手的瞬间广播，首页内容入场
 * （手风琴集结、揭幕碎片）据此挂起等待，让「切割开场」与「内容集结」
 * 重叠成同一套编排——参考 danzan.jiejoe.com 在 slash tween 的 onStart
 * 里调用 show_home 的做法。
 * 一次性信号：开屏揭幕整场只发生一次，之后所有调用直接短路。
 */

let resolved = false
let resolveFn: (() => void) | null = null
const revealed = new Promise<void>((resolve) => {
  resolveFn = resolve
})

/** 挥刀瞬间调用；重复调用无副作用。同时解除首页入场动画的开屏挂起。 */
export function markBootRevealed() {
  if (resolved) return
  resolved = true
  document.body.removeAttribute('data-boot-hold')
  resolveFn?.()
}

/** 揭幕信号触发后 resolve；未触发则挂起等待。 */
export function whenBootRevealed() {
  return revealed
}

/** 揭幕是否已发生（同步读）。 */
export function isBootRevealed() {
  return resolved
}
