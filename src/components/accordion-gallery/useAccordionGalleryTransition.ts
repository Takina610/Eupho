import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { isBootRevealed, whenBootRevealed } from '@/lib/bootReveal'

const INTRO_DURATION = 0.62
const INTRO_STAGGER = 0.055
const INTRO_OFFSET = -110

// 开屏冲击入场：面板从刀出的方向（右上切口）斜切集结归位，与居合斩
// 切割重叠播放，遮罩裂开时正好看见集结过程——对应参考站「挥刀瞬间
// 首页元素开始集结」的编排。日常返回首页仍走上面的温和入场。
const IMPACT_DURATION = 1.05
const IMPACT_STAGGER = 0.065
// 揭幕信号万一没来（揭幕层异常），最多挂起这么久就放行入场，别卡死首页
const REVEAL_FALLBACK_MS = 3500

// Exit plays inside the seam wipe (WIPE_MS = 1000ms): panels retract back to the
// intro offset, right to left, lifted clear before the wipe erases each one.
const EXIT_DURATION = 0.5
const EXIT_STAGGER = 0.06
const EXIT_EASE = 'power2.out'

function transitionOffset(vertical: boolean) {
  return vertical
    ? { xPercent: INTRO_OFFSET, yPercent: 0 }
    : { xPercent: 0, yPercent: INTRO_OFFSET }
}

export function useAccordionGalleryTransition({
  rootRef,
  vertical,
  count,
}: {
  rootRef: RefObject<HTMLDivElement | null>
  vertical: boolean
  count: number
}) {
  const insertRefs = useRef<(HTMLElement | null)[]>([])
  const enteredRef = useRef(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const waitedRef = useRef(false)
  const bootImpactRef = useRef(false)
  const fallbackTimerRef = useRef(0)

  const liveInserts = () => insertRefs.current.filter((node): node is HTMLElement => node != null)

  useLayoutEffect(() => {
    if (enteredRef.current || prefersReducedMotion()) {
      return
    }
    const inserts = liveInserts()
    if (inserts.length !== count) {
      return
    }
    gsap.set(inserts, { ...transitionOffset(vertical), rotation: 0 })
  }, [count, vertical])

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return
    }

    const layer = root.closest('[data-active]')

    const park = () => {
      tlRef.current?.kill()
      tlRef.current = null
      enteredRef.current = false
      root.style.pointerEvents = ''
      const inserts = liveInserts()
      if (!inserts.length) {
        return
      }
      if (prefersReducedMotion()) {
        gsap.set(inserts, { xPercent: 0, yPercent: 0, rotation: 0 })
        return
      }
      gsap.set(inserts, { ...transitionOffset(vertical), rotation: 0 })
    }

    const play = () => {
      const inserts = liveInserts()
      if (!inserts.length || enteredRef.current) {
        return
      }
      // 首次入场恰逢开屏：挂起到揭幕信号（切口过半）再播，让面板集结
      // 与切割后半段重叠。等待期间可能被切到别的场景，回来后由 resolve
      // 回调重新确认。fallback 只放开自己的等待，不动全局信号。
      if (!isBootRevealed() && !prefersReducedMotion()) {
        if (waitedRef.current) {
          return
        }
        waitedRef.current = true
        const fallback = new Promise<void>((resolve) => {
          fallbackTimerRef.current = window.setTimeout(resolve, REVEAL_FALLBACK_MS)
        })
        void Promise.race([whenBootRevealed(), fallback]).then(() => {
          window.clearTimeout(fallbackTimerRef.current)
          fallbackTimerRef.current = 0
          waitedRef.current = false
          if (layer?.getAttribute('data-active') === 'true') {
            bootImpactRef.current = true
            play()
          }
        })
        return
      }
      enteredRef.current = true
      tlRef.current?.kill()

      if (prefersReducedMotion()) {
        gsap.set(inserts, { xPercent: 0, yPercent: 0, rotation: 0 })
        return
      }

      root.style.pointerEvents = 'none'

      if (bootImpactRef.current) {
        bootImpactRef.current = false
        gsap.set(inserts, {
          xPercent: () => 24 + Math.random() * 56,
          yPercent: () => -(72 + Math.random() * 88),
          rotation: () => (Math.random() - 0.5) * 6,
        })
        tlRef.current = gsap.timeline({
          onComplete: () => {
            root.style.pointerEvents = ''
          },
        })
        tlRef.current.to(inserts, {
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          duration: IMPACT_DURATION,
          ease: 'power4.out',
          stagger: IMPACT_STAGGER,
        })
        return
      }

      gsap.set(inserts, transitionOffset(vertical))
      tlRef.current = gsap.timeline({
        onComplete: () => {
          root.style.pointerEvents = ''
        },
      })
      tlRef.current.to(inserts, {
        xPercent: 0,
        yPercent: 0,
        duration: INTRO_DURATION,
        ease: 'power3.out',
        stagger: INTRO_STAGGER,
      })
    }

    const exit = () => {
      const inserts = liveInserts()
      if (!inserts.length) {
        return
      }
      tlRef.current?.kill()
      tlRef.current = null
      enteredRef.current = false
      root.style.pointerEvents = ''

      if (prefersReducedMotion()) {
        gsap.set(inserts, { xPercent: 0, yPercent: 0, rotation: 0 })
        return
      }

      tlRef.current = gsap.timeline()
      tlRef.current.to(inserts, {
        ...transitionOffset(vertical),
        rotation: 0,
        duration: EXIT_DURATION,
        ease: EXIT_EASE,
        stagger: { each: EXIT_STAGGER, from: 'end' },
      })
    }

    const sync = () => {
      if (!layer) {
        return
      }
      const leaving = layer.getAttribute('data-leaving')
      if (leaving === 'forward' || leaving === 'backward') {
        exit()
        return
      }
      if (layer.getAttribute('data-active') === 'true') {
        play()
      } else {
        park()
      }
    }

    sync()

    if (!layer) {
      return () => {
        window.clearTimeout(fallbackTimerRef.current)
        tlRef.current?.kill()
        enteredRef.current = false
        waitedRef.current = false
        bootImpactRef.current = false
        root.style.pointerEvents = ''
      }
    }

    const observer = new MutationObserver(sync)
    observer.observe(layer, { attributes: true, attributeFilter: ['data-active', 'data-leaving'] })
    return () => {
      observer.disconnect()
      window.clearTimeout(fallbackTimerRef.current)
      tlRef.current?.kill()
      enteredRef.current = false
      waitedRef.current = false
      bootImpactRef.current = false
      root.style.pointerEvents = ''
    }
  }, [count, rootRef, vertical])

  return { insertRefs }
}
