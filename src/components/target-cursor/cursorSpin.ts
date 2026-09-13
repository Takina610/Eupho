import { gsap } from 'gsap'

// 自由态的自转时间线:锁定时暂停并归零角度,解锁后从当前角度无缝续转一整圈。
export function createCursorSpin(cursor: HTMLElement, initialDuration: number) {
  let timeline: gsap.core.Timeline | null = null
  let duration = initialDuration

  const build = () => {
    timeline?.kill()
    timeline = gsap.timeline({ repeat: -1 }).to(cursor, { rotation: '+=360', duration, ease: 'none' })
  }

  return {
    build,
    pause: () => {
      gsap.killTweensOf(cursor, 'rotation')
      timeline?.pause()
      gsap.set(cursor, { rotation: 0 })
    },
    resume: () => {
      const currentRotation = Number(gsap.getProperty(cursor, 'rotation'))
      const normalizedRotation = currentRotation % 360
      build()
      gsap.to(cursor, {
        rotation: normalizedRotation + 360,
        duration: duration * (1 - normalizedRotation / 360),
        ease: 'none',
        onComplete: () => timeline?.restart(),
      })
    },
    kill: () => {
      timeline?.kill()
      timeline = null
    },
  }
}
