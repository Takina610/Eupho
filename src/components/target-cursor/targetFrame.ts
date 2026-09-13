// 目标"有效框"测量与 containing block 补偿。
// 目标元素在布局里常被拉伸到整列宽,还可能带 margin/padding;
// 光标四角要贴合的是实际可见的框:带 border / background 的盒子
// (徽章、按钮)按自身边框盒包裹,纯文本块收缩到内容的紧致包围盒。

export function paintsOwnFrame(style: CSSStyleDeclaration): boolean {
  const hasBorder =
    parseFloat(style.borderTopWidth) > 0 ||
    parseFloat(style.borderRightWidth) > 0 ||
    parseFloat(style.borderBottomWidth) > 0 ||
    parseFloat(style.borderLeftWidth) > 0
  const background =
    style.backgroundImage !== 'none' ||
    (style.backgroundColor !== 'transparent' && style.backgroundColor !== 'rgba(0, 0, 0, 0)')
  return hasBorder || background
}

function unionContentRect(el: Element): DOMRect | null {
  if (!el.firstChild) {
    return null
  }
  const range = document.createRange()
  range.selectNodeContents(el)
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity
  for (const rect of range.getClientRects()) {
    if (rect.width === 0 && rect.height === 0) {
      continue
    }
    left = Math.min(left, rect.left)
    top = Math.min(top, rect.top)
    right = Math.max(right, rect.right)
    bottom = Math.max(bottom, rect.bottom)
  }
  if (left === Infinity) {
    return null
  }
  return new DOMRect(left, top, right - left, bottom - top)
}

export function getEffectiveFrameRect(el: Element): DOMRect {
  if (paintsOwnFrame(getComputedStyle(el))) {
    return el.getBoundingClientRect()
  }
  return unionContentRect(el) ?? el.getBoundingClientRect()
}

// position: fixed 相对视口定位,除非某个祖先(transform / perspective / filter /
// will-change / contain)成为 containing block,此时 translate 不再对应视口坐标,
// 需要测量该祖先并补偿偏移。
export function getContainingBlock(element: HTMLElement | null): HTMLElement | null {
  let node = element?.parentElement
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node)
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node
    }
    node = node.parentElement
  }
  return null
}

export function getContainingBlockOffset(block: HTMLElement | null): { x: number; y: number } {
  if (!block) {
    return { x: 0, y: 0 }
  }
  const rect = block.getBoundingClientRect()
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop }
}
