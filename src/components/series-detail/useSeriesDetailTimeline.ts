import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

type ElRef = RefObject<HTMLElement | null>

// Keep in sync with SeriesDetailStage.css: the stage uncovers through a seam
// wipe (same clip-path language as the fullpage scene wipes) while the copy
// choreographs in behind the reveal edge.
const WIPE_DURATION = 0.8
const WIPE_EASE = 'power3.inOut'
const HIDDEN_CLIP = 'inset(0% 0% 0% 100%)'
const FULL_CLIP = 'inset(0% 0% 0% 0%)'

export function useSeriesDetailTimeline({
  stageRef,
  scrimRef,
  onClosing,
  onExited,
}: {
  stageRef: ElRef
  scrimRef: ElRef
  onClosing?: () => void
  onExited: () => void
}) {
  const closingRef = useRef(false)
  const readyRef = useRef(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const scrim = scrimRef.current
    if (!stage || !scrim) {
      return
    }

    closingRef.current = false
    readyRef.current = false
    tlRef.current?.kill()
    gsap.killTweensOf([stage, scrim])
    gsap.set(stage, { clipPath: HIDDEN_CLIP })
    gsap.set(scrim, { autoAlpha: 0 })

    if (prefersReducedMotion()) {
      gsap.set(stage, { clipPath: FULL_CLIP })
      gsap.set(scrim, { autoAlpha: 1 })
      readyRef.current = true
      return
    }

    // The seam line lives in the portal root, outside the clipped stage.
    const root = stage.closest('.series-detail') ?? stage
    const q = gsap.utils.selector(root)
    const seam = q('.series-detail__seam')
    const hero = q('.series-detail__hero')
    const portrait = q('.series-detail__portrait')
    const rule = q('.series-detail__rule')
    const title = q('.series-detail__title')
    const copyItems = q('[data-copy-reveal]')
    const closeBtn = q('.series-detail__close')

    gsap.set(seam, { left: '100%', autoAlpha: 1 })
    gsap.set(hero, { scale: 1.16 })
    gsap.set(portrait, { yPercent: 112 })
    gsap.set(rule, { scaleY: 0 })
    gsap.set(title, { yPercent: 112 })
    gsap.set(copyItems, { y: 18, autoAlpha: 0 })
    // Plain opacity (not autoAlpha) so the focused close button stays focusable.
    gsap.set(closeBtn, { opacity: 0, scale: 0.85 })

    const tl = gsap.timeline()
    // Curtain: the stage is uncovered from its right edge — the direction the
    // fullpage forward wipe reveals new scenes — with the yellow seam riding it.
    tl.to(stage, { clipPath: FULL_CLIP, duration: WIPE_DURATION, ease: WIPE_EASE }, 0)
    tl.to(seam, { left: '0%', duration: WIPE_DURATION, ease: WIPE_EASE }, 0)
    tl.to(seam, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, WIPE_DURATION - 0.14)
    tl.to(scrim, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0)
    // The cover settles from a slight zoom so the panel arrives with depth.
    tl.to(hero, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0.08)
    // Copy choreography behind the wipe: portrait rises out of its mask, the
    // accent rule draws down, the title slides out of its mask, meta and
    // synopsis float up one after another.
    tl.to(portrait, { yPercent: 0, duration: 0.9, ease: 'power4.out' }, 0.48)
    tl.to(rule, { scaleY: 1, duration: 0.55, ease: 'power3.inOut' }, 0.56)
    tl.to(title, { yPercent: 0, duration: 0.7, ease: 'power4.out' }, 0.6)
    tl.to(copyItems, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out', stagger: 0.09 }, 0.66)
    tl.to(closeBtn, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }, 0.85)
    tl.call(
      () => {
        readyRef.current = true
      },
      undefined,
      0.45,
    )
    tlRef.current = tl

    return () => {
      tl.kill()
    }
  }, [scrimRef, stageRef])

  const close = useCallback(() => {
    if (closingRef.current || !readyRef.current) {
      return
    }
    closingRef.current = true

    const stage = stageRef.current
    const scrim = scrimRef.current

    if (!stage || !scrim || prefersReducedMotion()) {
      onClosing?.()
      onExited()
      return
    }

    // Release the scene dimming now so the background restores while the
    // stage wipes out — the two motions play together, not back to back.
    onClosing?.()
    tlRef.current?.kill()
    const q = gsap.utils.selector(stage.closest('.series-detail') ?? stage)
    const seam = q('.series-detail__seam')
    const tl = gsap.timeline({ onComplete: onExited })
    // Reverse of the entrance: copy leaves first, then the stage withdraws
    // back toward its right edge while the seam sweeps home.
    tl.to(q('.series-detail__close'), { opacity: 0, duration: 0.18, ease: 'power1.in' }, 0)
    tl.to(q('[data-copy-reveal]'), { y: -14, autoAlpha: 0, duration: 0.28, ease: 'power2.in', stagger: 0.04 }, 0)
    tl.to(q('.series-detail__title'), { yPercent: -112, duration: 0.42, ease: 'power3.in' }, 0)
    tl.to(q('.series-detail__rule'), { scaleY: 0, duration: 0.3, ease: 'power2.in' }, 0.03)
    tl.to(q('.series-detail__portrait'), { yPercent: 112, duration: 0.5, ease: 'power3.in' }, 0.04)
    tl.set(seam, { autoAlpha: 1 }, 0.08)
    tl.to(seam, { left: '100%', duration: 0.55, ease: WIPE_EASE }, 0.08)
    tl.to(seam, { autoAlpha: 0, duration: 0.18, ease: 'power1.in' }, 0.46)
    tl.to(stage, { clipPath: HIDDEN_CLIP, duration: 0.55, ease: WIPE_EASE }, 0.1)
    tl.to(scrim, { autoAlpha: 0, duration: 0.38, ease: 'power2.in' }, 0.16)
    tlRef.current = tl
  }, [onClosing, onExited, scrimRef, stageRef])

  return { close }
}
