import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { SeriesWork } from '@/constants/seriesCovers'
import { useSeriesDetailTimeline } from '@/components/series-detail/useSeriesDetailTimeline'
import '@/components/series-detail/SeriesDetailStage.css'

type SeriesDetailStageProps = {
  work: SeriesWork
  /** 所在区块是否处于前台；翻页离开时自动播放退场，避免 portal 残留在新页面上。 */
  active?: boolean
  /** Fired once when closing starts, before the exit animation plays out. */
  onClosing?: () => void
  onExited: () => void
}

export function SeriesDetailStage({ work, active, onClosing, onExited }: SeriesDetailStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const { close } = useSeriesDetailTimeline({
    stageRef,
    scrimRef,
    onClosing,
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

  useEffect(() => {
    if (active === false) {
      close()
    }
  }, [active, close])

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
          <div className="series-detail__portrait-mask">
            <img className="series-detail__portrait" src={work.portrait} alt={work.alt} draggable={false} />
          </div>
          <div className="series-detail__copy">
            <span className="series-detail__rule" aria-hidden="true" />
            <div className="series-detail__text">
              <p className="series-detail__meta" data-copy-reveal>
                <span>{work.year}</span>
                <span aria-hidden="true">·</span>
                <span>{work.kind}</span>
              </p>
              <div className="series-detail__mask">
                <h2 id="series-detail-title" className="series-detail__title">
                  {work.title}
                </h2>
              </div>
              <p className="series-detail__synopsis" data-copy-reveal>
                {work.synopsis}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Seam line riding the stage's clip reveal; outside the stage so the
          wipe edge never clips it. */}
      <div className="series-detail__frame" aria-hidden="true">
        <span className="series-detail__seam" />
      </div>
    </div>,
    document.body,
  )
}
