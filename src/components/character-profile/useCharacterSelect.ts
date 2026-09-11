import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CHARACTERS } from '@/constants/characters'
import {
  captureOutgoing,
  clearGhosts,
  decodeCharacter,
  fitWatermark,
  playCharacterSwitch,
} from '@/components/character-profile/characterSwitch'
import { prefersReducedMotion } from '@/lib/motion'

export function useCharacterSelect() {
  const [index, setIndex] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const targetRef = useRef(0)
  const genRef = useRef(0)
  const playedIndexRef = useRef<number | null>(null)
  const ghostsRef = useRef<HTMLElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const count = CHARACTERS.length
  const character = CHARACTERS[index] ?? CHARACTERS[0]
  const uniqueBackdrop = character.backdrop !== character.image

  const goTo = useCallback((next: number) => {
    const wrapped = ((next % count) + count) % count
    if (wrapped === targetRef.current) {
      return
    }

    targetRef.current = wrapped
    const gen = ++genRef.current
    const nextCharacter = CHARACTERS[wrapped]
    if (!nextCharacter) {
      return
    }

    void decodeCharacter(nextCharacter).then(() => {
      if (gen !== genRef.current) {
        return
      }

      const root = stageRef.current
      tlRef.current?.kill()
      root?.classList.remove('is-switching')
      clearGhosts(ghostsRef.current)
      ghostsRef.current = []

      if (root && !prefersReducedMotion()) {
        ghostsRef.current = captureOutgoing(root)
        gsap.set(root.querySelectorAll('[data-cp-layer]'), { opacity: 0, force3D: true })
      }

      indexRef.current = wrapped
      setIndex(wrapped)
    })
  }, [count])

  const select = useCallback((next: number) => {
    goTo(next)
  }, [goTo])

  const step = useCallback((delta: 1 | -1) => {
    const next = ((targetRef.current + delta) % count + count) % count
    goTo(targetRef.current + delta)
    return next
  }, [count, goTo])

  useEffect(() => {
    for (const offset of [-1, 1, 2]) {
      const item = CHARACTERS[((index + offset) % count + count) % count]
      if (!item) {
        continue
      }
      void decodeCharacter(item)
    }
  }, [count, index])

  useLayoutEffect(() => {
    const root = stageRef.current
    if (!root) {
      return
    }

    const stage = root.querySelector<HTMLElement>('.cp__stage')
    const watermark = root.querySelector<HTMLElement>('.cp__watermark:not(.cp__switch-ghost)')
    fitWatermark(watermark, stage)

    if (playedIndexRef.current === index) {
      return
    }
    playedIndexRef.current = index

    if (ghostsRef.current.length === 0) {
      gsap.set(root.querySelectorAll('[data-cp-layer]'), { x: 0, opacity: 1, force3D: true })
      return
    }

    root.classList.add('is-switching')
    tlRef.current?.kill()
    tlRef.current = playCharacterSwitch({
      root,
      ghosts: ghostsRef.current,
      reducedMotion: prefersReducedMotion(),
      onComplete: () => {
        root.classList.remove('is-switching')
        clearGhosts(ghostsRef.current)
        ghostsRef.current = []
      },
    })
  }, [index])

  useEffect(() => {
    return () => {
      tlRef.current?.kill()
      clearGhosts(ghostsRef.current)
    }
  }, [])

  return { character, count, index, select, stageRef, step, uniqueBackdrop }
}
