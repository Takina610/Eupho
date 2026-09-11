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

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 8 14" className="h-4 w-2.5" fill="none" aria-hidden>
      <path
        d={direction === 'left' ? 'M7 1 1 7l6 6' : 'M1 1l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
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

      {/* keyed remount replays the slide-in animations on open and on instrument switch */}
      <div
        key={open ? instrument.id : 'closed'}
        className="absolute max-sm:inset-x-6 max-sm:bottom-[13vh] sm:right-[6vw] sm:top-1/2 sm:w-[min(38rem,40vw)] sm:-translate-y-1/2"
      >
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
      </div>

      <button
        type="button"
        onClick={() => onStep(-1)}
        aria-label="上一件乐器"
        className="absolute left-3 top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white max-sm:top-[40%] sm:left-6"
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        onClick={() => onStep(1)}
        aria-label="下一件乐器"
        className="absolute right-3 top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white max-sm:top-[40%] sm:right-6"
      >
        <Chevron direction="right" />
      </button>

      <nav
        aria-label="乐器快速切换"
        className="absolute inset-x-0 bottom-0 z-10 flex h-10 max-sm:inset-x-5"
      >
        {INSTRUMENTS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onJump(i)}
            aria-label={item.name}
            aria-current={i === index || undefined}
            className="h-full flex-1 border-ink/80 bg-white/20 bg-clip-content py-2 transition-colors hover:bg-white/50 [&+&]:border-l"
          />
        ))}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-2 top-2 bg-accent transition-[left] duration-300"
          style={{ width: `${100 / total}%`, left: `${(index * 100) / total}%` }}
        />
      </nav>

      <button
        type="button"
        onClick={onClose}
        className="absolute bottom-8 right-0 z-10 hidden min-h-11 items-center gap-3 bg-white/10 py-2 pl-6 pr-8 text-left text-white transition-colors hover:bg-white hover:text-ink sm:flex"
      >
        <Chevron direction="left" />
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
