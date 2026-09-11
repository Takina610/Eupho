export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function resistOffset(offset: number, max: number, ratio = 0.15) {
  if (offset < 0) {
    return offset * ratio
  }
  if (offset > max) {
    return max + (offset - max) * ratio
  }
  return offset
}

export function trackOverflow(track: HTMLElement, viewport: HTMLElement) {
  return Math.max(0, track.scrollWidth - viewport.clientWidth)
}

export function knobLayout(track: HTMLElement, viewport: HTMLElement, progress: HTMLElement) {
  const view = viewport.clientWidth
  const content = track.scrollWidth
  const max = Math.max(0, content - view)
  const bar = progress.clientWidth
  const knobWidth = content > 0 ? (view / content) * bar : bar
  const travel = Math.max(0, bar - knobWidth)
  return { knobWidth, max, travel }
}

export function offsetFromProgressX(
  clientX: number,
  progress: HTMLElement,
  knobWidth: number,
  travel: number,
  max: number,
) {
  const x = clamp(clientX - progress.getBoundingClientRect().left - knobWidth / 2, 0, travel)
  return travel > 0 ? (x / travel) * max : 0
}

export function offsetToReveal(track: HTMLElement, viewport: HTMLElement, index: number, offset: number) {
  const slide = track.children[index]
  if (!(slide instanceof HTMLElement)) {
    return null
  }

  const max = trackOverflow(track, viewport)
  const viewEnd = offset + viewport.clientWidth
  const slideStart = slide.offsetLeft
  const slideEnd = slideStart + slide.offsetWidth
  if (slideStart < offset) {
    return clamp(slideStart, 0, max)
  }
  if (slideEnd > viewEnd) {
    return clamp(slideEnd - viewport.clientWidth, 0, max)
  }
  return null
}
