import { useRef, type MouseEvent, type PointerEvent, type RefObject } from 'react'
import { nearestNoteIndex } from '@/lib/seriesStaffLayout'

const SWIPE_IGNORE_PX = 16

export function useSeriesStaffPointer({
  count,
  activeIndex,
  recessed,
  hoverSelect,
  fieldRef,
  onActiveChange,
  onOpenActive,
}: {
  count: number
  activeIndex: number
  recessed: boolean
  hoverSelect: boolean
  fieldRef: RefObject<HTMLDivElement | null>
  onActiveChange: (index: number) => void
  onOpenActive?: (index: number) => void
}) {
  const startRef = useRef<{ x: number; y: number } | null>(null)

  const indexFromEvent = (clientX: number) => {
    const field = fieldRef.current
    if (!field) {
      return activeIndex
    }
    return nearestNoteIndex(field, clientX, count)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (recessed || !hoverSelect || event.pointerType !== 'mouse') {
      return
    }
    const next = indexFromEvent(event.clientX)
    if (next !== activeIndex) {
      onActiveChange(next)
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startRef.current = { x: event.clientX, y: event.clientY }
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (recessed) {
      return
    }
    const start = startRef.current
    startRef.current = null
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > SWIPE_IGNORE_PX) {
      return
    }
    const next = indexFromEvent(event.clientX)
    if (next === activeIndex) {
      onOpenActive?.(next)
      return
    }
    onActiveChange(next)
  }

  return { handlePointerMove, handlePointerDown, handleClick }
}
