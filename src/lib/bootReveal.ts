/**
 * 居合斩揭幕信号。KatanaReveal 在切口过半（挥刀起手后片刻）才广播，
 * 首页内容入场（手风琴集结、谱条奏响）据此挂起等待——遮罩前半程基本
 * 没让开，等页面真的看得见了再让内容入场，与切割后半段重叠成一套编排。
 * 一次性信号：开屏揭幕整场只发生一次，之后所有调用直接短路。
 */

let resolved = false
let resolveFn: (() => void) | null = null
const revealed = new Promise<void>((resolve) => {
  resolveFn = resolve
})

/** 切口过半时调用；重复调用无副作用。同时解除首页入场动画的开屏挂起。 */
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
