import { useLayoutEffect, useRef, type RefObject } from 'react'
import { seriesStaffPitch } from '@/constants/seriesStaff'
import { playStaffTone, unlockStaffTone } from '@/lib/staffTone'
import { prefersReducedMotion } from '@/lib/motion'

export function useStaffPlayback({
  activeIndex,
  recessed,
  noteRefs,
}: {
  activeIndex: number
  recessed: boolean
  noteRefs: RefObject<(HTMLButtonElement | null)[]>
}) {
  const previousRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const previous = previousRef.current
    previousRef.current = activeIndex
    if (previous === null || recessed || prefersReducedMotion()) {
      return
    }

    unlockStaffTone()
    playStaffTone(seriesStaffPitch(activeIndex))
    const note = noteRefs.current[activeIndex]
    if (!note) {
      return
    }
    note.classList.remove('is-striking')
    void note.offsetWidth
    note.classList.add('is-striking')
  }, [activeIndex, recessed, noteRefs])
}
