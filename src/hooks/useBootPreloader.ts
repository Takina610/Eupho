import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { PRELOAD_IMAGES } from '@/constants/preloadManifest'
import { BOOT_FADE_MS, BOOT_MAX_WAIT_MS, BOOT_MIN_SHOW_MS } from '@/constants/bootLoader'
import { getBootPreloadTask } from '@/lib/preloadImages'

export type BootPhase =
  | 'loading' // 预载进行中，盖住页面
  | 'leaving' // 预载完成，内容已挂载，加载层淡出中
  | 'gone' // 淡出结束，卸载加载层

/**
 * 开屏预载全站图片并给出阶段与进度。
 * - 最少展示 BOOT_MIN_SHOW_MS，避免快网下加载层一闪而过；
 * - 最长等待 BOOT_MAX_WAIT_MS，个别图片挂起时兜底放行。
 */
export function useBootPreloader() {
  const task = getBootPreloadTask(PRELOAD_IMAGES)
  const snapshot = useSyncExternalStore(task.subscribe, task.getSnapshot)
  const [phase, setPhase] = useState<BootPhase>('loading')
  const shownAtRef = useRef(Number.POSITIVE_INFINITY)

  useEffect(() => {
    shownAtRef.current = performance.now()
    let cancelled = false
    let finished = false
    const timers: number[] = []

    const finish = () => {
      if (cancelled || finished) return
      finished = true
      const remain = Math.max(0, BOOT_MIN_SHOW_MS - (performance.now() - shownAtRef.current))
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setPhase('leaving')
        }, remain),
      )
    }

    void task.promise.then(finish, finish)
    timers.push(window.setTimeout(finish, BOOT_MAX_WAIT_MS))

    return () => {
      cancelled = true
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [task])

  useEffect(() => {
    if (phase !== 'leaving') return
    const timer = window.setTimeout(() => setPhase('gone'), BOOT_FADE_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  return {
    progress: snapshot.total > 0 ? snapshot.loaded / snapshot.total : 1,
    phase,
  }
}
