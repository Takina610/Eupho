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
  const rects: DOMRect[] = []
  // 文本与行内内容
  const range = document.createRange()
  range.selectNodeContents(el)
  rects.push(...Array.from(range.getClientRects()))
  // 绝对定位等元素子盒(如缩略图的相纸卡面、名字条);隐藏的子盒
  // (如未激活缩略图 opacity:0 的折角标签)不计入,避免框大于可见内容
  for (const child of el.children) {
    const style = getComputedStyle(child)
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
      continue
    }
    rects.push(child.getBoundingClientRect())
  }
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity
  for (const rect of rects) {
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

// 命中判定用有效框而不是元素盒:纯文本块被布局拉伸到整列宽,
// 指针落在文字以外的空白区不应触发锁定。tolerance 给小号文字留出容差。
export function isPointInFrame(el: Element, x: number, y: number, tolerance = 4): boolean {
  const rect = getEffectiveFrameRect(el)
  return (
    x >= rect.left - tolerance &&
    x <= rect.right + tolerance &&
    y >= rect.top - tolerance &&
    y <= rect.bottom + tolerance
  )
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
