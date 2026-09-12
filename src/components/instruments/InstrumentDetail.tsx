import { useEffect, useState } from 'react'

import { INSTRUMENTS, type Instrument } from '@/constants/instruments'

type InstrumentDetailProps = {
  instrument: Instrument
  index: number
  open: boolean
  onStep: (delta: 1 | -1) => void
  onJump: (index: number) => void
  onClose: () => void
  onOpenList: () => void
}

/**
 * Copy-block stages: 'reveal' is the masked slide-in when the detail opens;
 * 'exit'/'enter' is the sequential swap on instrument changes — the old copy
 * fades out to the left first, then the new copy fades in from the right.
 */
type CopyStage = 'reveal' | 'exit' | 'enter'

// The outgoing copy must be gone before the swapped-in copy mounts.
// Keep in sync with .inst-swap-out's delays + duration in instruments.css.
const EXIT_TOTAL_MS = 530

function Chevron({
  direction,
  className = 'h-9 w-10 sm:h-10 sm:w-11',
}: {
  direction: 'left' | 'right'
  className?: string
}) {
  return (
    <svg viewBox="0 0 15 14" className={className} fill="none" aria-hidden>
      {direction === 'left' ? (
        <>
          <path d="M7 1 2 7l5 6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M13 1 8 7l5 6" stroke="currentColor" strokeWidth="1.2" />
        </>
      ) : (
        <>
          <path d="M8 1l5 6-5 6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2 1l5 6-5 6" stroke="currentColor" strokeWidth="1.2" />
        </>
      )}
    </svg>
  )
}

function RevealCopy({ instrument }: { instrument: Instrument }) {
  return (
    <>
      <div className="inst-reveal-mask">
        <span className="inst-reveal-item text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {instrument.name}
        </span>
      </div>
      <div className="inst-reveal-mask mt-2">
        <span
          className="inst-reveal-item text-base font-semibold uppercase tracking-[0.22em] text-brand sm:text-lg"
          style={{ animationDelay: '90ms' }}
        >
          {instrument.nameEn}
        </span>
      </div>
      <div className="inst-rule my-4 max-sm:my-3" />
      <p className="max-w-xl overflow-hidden text-sm leading-relaxed text-white/75 sm:text-base">
        <span className="inst-reveal-item from-above" style={{ animationDelay: '180ms' }}>
          {instrument.intro}
        </span>
      </p>
    </>
  )
}

function SwapCopy({ instrument, exiting }: { instrument: Instrument; exiting: boolean }) {
  const delays = exiting ? ['0ms', '60ms', '120ms'] : ['0ms', '90ms', '180ms']
  const item = exiting ? 'inst-swap-item inst-swap-out' : 'inst-swap-item inst-swap-in'
  return (
    <>
      <div
        className={`${item} text-4xl font-bold tracking-tight text-white sm:text-5xl`}
        style={{ animationDelay: delays[0] }}
      >
        {instrument.name}
      </div>
      <div
        className={`${item} mt-2 text-base font-semibold uppercase tracking-[0.22em] text-brand sm:text-lg`}
        style={{ animationDelay: delays[1] }}
      >
        {instrument.nameEn}
      </div>
      <div className={`${item} inst-rule my-4 max-sm:my-3`} style={{ animationDelay: delays[1] }} />
      <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
        <span className={`${item} block`} style={{ animationDelay: delays[2] }}>
          {instrument.intro}
        </span>
      </p>
    </>
  )
}

/**
 * Detail panel in the AK-world style: masked slide-in copy on the right, edge arrows,
 * a segmented progress bar with the accent pointer, and a back action.
 */
export function InstrumentDetail({
  instrument,
  index,
  open,
  onStep,
  onJump,
  onClose,
  onOpenList,
}: InstrumentDetailProps) {
  const total = INSTRUMENTS.length
  const [shownId, setShownId] = useState(instrument.id)
  const [stage, setStage] = useState<CopyStage>('reveal')

  // Prop-driven state adjustments (React's "adjust state during render" pattern):
  // (re)opening arms the masked reveal; a switch while open arms the exit stage.
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    setStage('reveal')
    setShownId(instrument.id)
  } else if (open && instrument.id !== shownId && stage !== 'exit') {
    setStage('exit')
  }

  // The exit stage only mounts the new copy once its animation has run out.
  useEffect(() => {
    if (!open || stage !== 'exit' || instrument.id === shownId) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(
      () => {
        setShownId(instrument.id)
        setStage('enter')
      },
      reduced ? 0 : EXIT_TOTAL_MS,
    )
    return () => window.clearTimeout(timer)
  }, [instrument.id, open, shownId, stage])

  const shown = INSTRUMENTS.find((item) => item.id === shownId) ?? instrument

  return (
    <div
      className={`inst-panel inst-detail absolute inset-0 z-20 ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      data-open={open}
      aria-hidden={!open}
    >
      {/* readability scrim behind the copy on phones */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[46vh] bg-gradient-to-t from-ink/90 via-ink/50 to-transparent sm:hidden"
      />

      {/* keyed remount replays the copy animations on open and on instrument switch */}
      <div
        key={open ? `${stage}:${shownId}` : 'closed'}
        className="absolute max-sm:inset-x-6 max-sm:bottom-[13vh] sm:right-[6vw] sm:top-1/2 sm:w-[min(38rem,40vw)] sm:-translate-y-1/2"
      >
        {stage === 'reveal' ? (
          <RevealCopy instrument={shown} />
        ) : (
          <SwapCopy instrument={shown} exiting={stage === 'exit'} />
        )}
      </div>

      <button
        type="button"
        onClick={() => onStep(-1)}
        aria-label="上一件乐器"
        className="absolute left-5 top-1/2 z-10 flex min-h-14 min-w-14 -translate-y-1/2 items-center justify-center text-white/80 transition hover:text-white max-sm:top-[40%] sm:left-20"
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        onClick={() => onStep(1)}
        aria-label="下一件乐器"
        className="absolute right-5 top-1/2 z-10 flex min-h-14 min-w-14 -translate-y-1/2 items-center justify-center text-white/80 transition hover:text-white max-sm:top-[40%] sm:right-20"
      >
        <Chevron direction="right" />
      </button>

      {/* AK 风格进度条：灰色轨道 + 青色位置块，横向平铺的透明按钮保留跳转 */}
      <nav
        aria-label="乐器快速切换"
        className="absolute inset-x-0 bottom-0 z-10 flex h-10 max-sm:inset-x-5"
      >
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/25" />
        <div
          aria-hidden
          className="absolute top-1/2 h-[10px] -translate-y-1/2 bg-accent transition-[left] duration-300"
          style={{ width: `${100 / total}%`, left: `${(index * 100) / total}%` }}
        />
        {INSTRUMENTS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onJump(i)}
            aria-label={item.name}
            aria-current={i === index || undefined}
            className="relative h-full flex-1"
          />
        ))}
      </nav>

      <button
        type="button"
        onClick={onClose}
        className="inst-back absolute bottom-0 right-0 z-20 hidden h-10 items-center gap-3 bg-deep pl-6 pr-8 text-left text-white hover:bg-accent hover:text-ink sm:flex"
      >
        <Chevron direction="left" className="h-3.5 w-4" />
        <span className="text-sm font-bold leading-tight">
          返回
          <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.28em] opacity-70">
            Go Back
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenList}
        className="absolute bottom-[9vh] right-5 z-10 min-h-11 border border-white/50 px-4 text-xs font-semibold tracking-widest text-white sm:hidden"
      >
        查看列表
      </button>
    </div>
  )
}
