import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { SeriesWork } from '@/constants/seriesCovers'
import { useSeriesDetailTimeline } from '@/components/series-detail/useSeriesDetailTimeline'
import '@/components/series-detail/SeriesDetailStage.css'

type SeriesDetailStageProps = {
  work: SeriesWork
  onExited: () => void
}

export function SeriesDetailStage({ work, onExited }: SeriesDetailStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const { close } = useSeriesDetailTimeline({
    stageRef,
    scrimRef,
    onExited,
  })

  const onKeyClose = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        close()
      }
    },
    [close],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyClose, true)
    closeBtnRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyClose, true)
  }, [onKeyClose])

  return createPortal(
    <div className="series-detail" role="presentation">
      <button
        ref={scrimRef}
        type="button"
        className="series-detail__scrim"
        aria-label="关闭简介"
        onClick={close}
      />
      <div
        ref={stageRef}
        className="series-detail__stage"
        role="dialog"
        aria-modal="true"
        aria-labelledby="series-detail-title"
      >
        <img
          className="series-detail__hero"
          src={work.image}
          alt=""
          draggable={false}
          style={{ objectPosition: `${work.focusX ?? 50}% 50%` }}
        />
        <span className="series-detail__veil" aria-hidden="true" />
        <button
          ref={closeBtnRef}
          type="button"
          className="series-detail__close"
          aria-label="关闭"
          onClick={close}
        >
          ×
        </button>
        <div className="series-detail__body">
          <img className="series-detail__portrait" src={work.portrait} alt={work.alt} draggable={false} />
          <div className="series-detail__copy">
            <span className="series-detail__rule" aria-hidden="true" />
            <div className="series-detail__text">
              <p className="series-detail__meta">
                <span>{work.year}</span>
                <span aria-hidden="true">·</span>
                <span>{work.kind}</span>
              </p>
              <h2 id="series-detail-title" className="series-detail__title">
                {work.title}
              </h2>
              <p className="series-detail__synopsis">{work.synopsis}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
