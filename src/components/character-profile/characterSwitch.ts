import { gsap } from 'gsap'
import type { Character } from '@/constants/characters'

export const MAIN_EXIT_X = '1.5rem'
export const MAIN_ENTER_X = '-1.5rem'
export const BACK_EXIT_X = '-1.5rem'
export const BACK_ENTER_X = '1.5rem'

const EXIT_DURATION = 0.3
const ENTER_DURATION = 0.3
const SWITCH_EASE = 'power3.out'
const ENTER_AT = 0.35

export function fitWatermark(el: HTMLElement | null, stage: HTMLElement | null) {
  if (!el || !stage) {
    return
  }

  const probe = el.cloneNode(true) as HTMLElement
  probe.removeAttribute('data-cp-layer')
  probe.classList.add('cp__switch-ghost')
  probe.style.cssText = [
    'position:absolute',
    'left:0',
    'top:0',
    'visibility:hidden',
    'pointer-events:none',
    'opacity:1',
    'transform:none',
    'width:max-content',
    'font-size:100px',
  ].join(';')
  stage.appendChild(probe)
  const textWidth = probe.scrollWidth
  probe.remove()
  if (textWidth <= 0) {
    return
  }

  el.style.fontSize = `${(stage.clientWidth / textWidth) * 104}px`
}

export function decodeCharacter(character: Character) {
  return Promise.all([decodeSrc(character.image), decodeSrc(character.backdrop)]).then(() => undefined)
}

function decodeSrc(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    const finish = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(() => resolve()).catch(() => resolve())
        return
      }
      resolve()
    }

    img.onload = finish
    img.onerror = () => resolve()
    img.src = src
    if (img.complete && img.naturalWidth > 0) {
      finish()
    }
  })
}

export function captureOutgoing(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>('[data-cp-layer]')].map((layer) => snapshotLayer(layer))
}

export function clearGhosts(ghosts: HTMLElement[]) {
  for (const ghost of ghosts) {
    gsap.killTweensOf(ghost)
    ghost.remove()
  }
}

export function playCharacterSwitch({
  root,
  ghosts,
  reducedMotion,
  onComplete,
}: {
  root: HTMLElement
  ghosts: HTMLElement[]
  reducedMotion: boolean
  onComplete: () => void
}) {
  const live = [...root.querySelectorAll<HTMLElement>('[data-cp-layer]')]
  const liveMain = live.filter((el) => el.dataset.cpLayer === 'main')
  const liveCopy = live.filter((el) => el.dataset.cpLayer === 'copy')
  const liveBack = live.filter((el) => el.dataset.cpLayer === 'back')
  const ghostMain = ghosts.filter((el) => el.dataset.cpExit === 'main')
  const ghostCopy = ghosts.filter((el) => el.dataset.cpExit === 'copy')
  const ghostBack = ghosts.filter((el) => el.dataset.cpExit === 'back')

  gsap.killTweensOf([...live, ...ghosts])

  if (reducedMotion) {
    gsap.set(live, { x: 0, opacity: 1, force3D: true })
    onComplete()
    return gsap.timeline()
  }

  const tl = gsap.timeline({ onComplete })
  gsap.set(liveMain, { x: MAIN_ENTER_X, opacity: 0, force3D: true })
  gsap.set(liveCopy, { x: MAIN_ENTER_X, opacity: 0, force3D: true })
  gsap.set(liveBack, { x: BACK_ENTER_X, opacity: 0, force3D: true })

  if (ghostMain.length) {
    tl.to(ghostMain, { x: MAIN_EXIT_X, opacity: 0, duration: EXIT_DURATION, ease: SWITCH_EASE, force3D: true }, 0)
  }
  if (ghostCopy.length) {
    tl.to(ghostCopy, { x: MAIN_EXIT_X, opacity: 0, duration: EXIT_DURATION, ease: SWITCH_EASE, force3D: true }, 0)
  }
  if (ghostBack.length) {
    tl.to(ghostBack, { x: BACK_EXIT_X, opacity: 0, duration: EXIT_DURATION, ease: SWITCH_EASE, force3D: true }, 0)
  }

  tl.to(liveBack, { x: 0, opacity: 1, duration: ENTER_DURATION, ease: SWITCH_EASE, force3D: true }, ENTER_AT)
  tl.to(liveCopy, { x: 0, opacity: 1, duration: ENTER_DURATION, ease: SWITCH_EASE, force3D: true }, ENTER_AT)
  tl.to(liveMain, { x: 0, opacity: 1, duration: ENTER_DURATION, ease: SWITCH_EASE, force3D: true }, ENTER_AT)

  return tl
}

function snapshotLayer(layer: HTMLElement) {
  const parent = layer.parentElement
  if (!parent) {
    return layer
  }

  const parentRect = parent.getBoundingClientRect()
  const rect = layer.getBoundingClientRect()
  const clone = layer.cloneNode(true) as HTMLElement
  clone.dataset.cpExit = layer.dataset.cpLayer
  clone.removeAttribute('data-cp-layer')
  clone.removeAttribute('data-cp-fade')
  clone.classList.add('cp__switch-ghost')
  const isWatermark = layer.classList.contains('cp__watermark')
  parent.appendChild(clone)
  gsap.set(clone, {
    position: 'absolute',
    left: rect.left - parentRect.left,
    top: rect.top - parentRect.top,
    width: isWatermark ? 'auto' : rect.width,
    height: isWatermark ? 'auto' : rect.height,
    margin: 0,
    x: gsap.getProperty(layer, 'x'),
    y: 0,
    opacity: gsap.getProperty(layer, 'opacity'),
    zIndex: 5,
    pointerEvents: 'none',
    force3D: true,
  })
  return clone
}
