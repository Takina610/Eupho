import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { SERIES_WORKS } from '@/constants/seriesCovers'
import { STAFF_BASS_CLEF_SRC, seriesStaffNote, staffNoteStemDown, staffNoteWide } from '@/constants/seriesStaff'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import {
  CLEF_HEIGHT,
  CLEF_TOP,
  STAFF_LINE_BOTTOM,
  STAFF_LINE_TOP,
  noteLeftPercent,
  pitchTopPercent,
} from '@/lib/seriesStaffLayout'
import { StaffGlyph } from '@/components/series-staff/StaffGlyph'
import { useSeriesStaffPointer } from '@/components/series-staff/useSeriesStaffPointer'
import { useStaffPlayback } from '@/components/series-staff/useStaffPlayback'
import { unlockStaffTone } from '@/lib/staffTone'
import '@/components/series-staff/SeriesStaff.css'

const FINE_HOVER_QUERY = '(hover: hover) and (pointer: fine)'

type SeriesStaffProps = {
  activeIndex: number
  onActiveChange: (index: number) => void
  onOpenActive?: (index: number) => void
  recessed?: boolean
  dimmed?: boolean
}

export function SeriesStaff({
  activeIndex,
  onActiveChange,
  onOpenActive,
  recessed = false,
  dimmed = false,
}: SeriesStaffProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const keyRefs = useRef<(HTMLButtonElement | null)[]>([])
  const hoverSelect = useMatchMedia(FINE_HOVER_QUERY)
  const count = SERIES_WORKS.length
  const work = SERIES_WORKS[activeIndex]
  const { handlePointerMove, handlePointerDown, handleClick } = useSeriesStaffPointer({
    count,
    activeIndex,
    recessed,
    hoverSelect,
    fieldRef,
    onActiveChange,
    onOpenActive,
  })
  useStaffPlayback({
    activeIndex,
    recessed,
    noteRefs: keyRefs,
  })

  useEffect(() => {
    const root = rootRef.current
    const key = keyRefs.current[activeIndex]
    if (!root || !key || !root.contains(document.activeElement)) {
      return
    }
    key.focus()
  }, [activeIndex])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (recessed) {
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()
      const step = event.key === 'ArrowRight' ? 1 : -1
      const next = Math.min(Math.max(activeIndex + step, 0), count - 1)
      if (next !== activeIndex) {
        onActiveChange(next)
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className={`series-staff${recessed ? ' is-recessed' : ''}${dimmed ? ' is-dimmed' : ''}`}
      style={{ '--note-last': count - 1 } as CSSProperties}
      data-fullpage-ignore
      role="group"
      aria-label="系列时间轴"
      onKeyDown={onKeyDown}
    >
      {work ? (
        <p className="series-staff__cue" aria-live="polite">
          <span key={work.id} className="series-staff__cue-in">
            <span className="series-staff__cue-meta">
              {work.year}
              <span aria-hidden="true"> · </span>
              {work.kind}
            </span>
            <span className="series-staff__cue-label">{work.label}</span>
          </span>
        </p>
      ) : null}
      <div className="series-staff__board">
        <div
          ref={fieldRef}
          className="series-staff__field"
          onPointerMove={handlePointerMove}
          onPointerDown={(event) => {
            unlockStaffTone()
            handlePointerDown(event)
          }}
          onClick={handleClick}
        >
          {/* 击音涟漪：光晕+声波环+双跳音，key 取当前作品，换曲重挂载即重播 */}
          {work ? (
            <span
              key={work.id}
              className="series-staff__ripple"
              aria-hidden
              style={{
                left: `${noteLeftPercent(activeIndex, count)}%`,
                top: `${pitchTopPercent(seriesStaffNote(activeIndex).pitch)}%`,
              }}
            >
              <i>
                <StaffGlyph kind="eighth" />
              </i>
              <i>
                <StaffGlyph kind="quarter" />
              </i>
            </span>
          ) : null}
          {/* 进场收尾：两枚跳音符号从谱上飘起，只在屏层激活时播一次 */}
          <span
            className="series-staff__spark"
            aria-hidden
            style={{ left: `${noteLeftPercent(1, count)}%`, top: `${pitchTopPercent(8)}%` }}
          >
            <StaffGlyph kind="eighth" />
          </span>
          <span
            className="series-staff__spark series-staff__spark--b"
            aria-hidden
            style={{ left: `${noteLeftPercent(7, count)}%`, top: `${pitchTopPercent(3)}%` }}
          >
            <StaffGlyph kind="quarter" />
          </span>
          <div
            className="series-staff__lines"
            style={{ top: `${STAFF_LINE_TOP}%`, bottom: `${100 - STAFF_LINE_BOTTOM}%` }}
            aria-hidden="true"
          >
            {Array.from({ length: 5 }, (_, lineIndex) => (
              <i key={lineIndex} style={{ '--line-i': lineIndex } as CSSProperties} />
            ))}
          </div>
          <img
            className="series-staff__clef"
            src={STAFF_BASS_CLEF_SRC}
            alt=""
            draggable={false}
            aria-hidden
            style={{ top: `${CLEF_TOP}%`, height: `${CLEF_HEIGHT}%` }}
          />
          {SERIES_WORKS.map((item, index) => {
            const note = seriesStaffNote(index)
            const isActive = index === activeIndex
            const classes = [
              'series-staff__note',
              staffNoteWide(note) ? 'is-wide' : '',
              staffNoteStemDown(note) ? 'is-stem-down' : '',
              isActive ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button
                key={item.id}
                ref={(el) => {
                  keyRefs.current[index] = el
                }}
                type="button"
                className={classes}
                style={{
                  '--note-i': index,
                  left: `${noteLeftPercent(index, count)}%`,
                  top: `${pitchTopPercent(note.pitch)}%`,
                } as CSSProperties}
                tabIndex={recessed ? -1 : isActive ? 0 : -1}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${item.year} ${item.kind} ${item.label}`}
                onKeyDown={onKeyDown}
                onClick={(event) => {
                  event.stopPropagation()
                  if (isActive) {
                    onOpenActive?.(index)
                    return
                  }
                  onActiveChange(index)
                }}
              >
                <StaffGlyph kind={note.kind} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
