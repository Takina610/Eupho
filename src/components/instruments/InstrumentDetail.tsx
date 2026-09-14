import { useEffect, useState } from 'react'
import { MorphIcon } from 'morphicons/react'
import { Music, Music4 } from 'lucide'

import { useInstrumentSound } from '@/hooks/useInstrumentSound'
import { INSTRUMENTS, type Instrument } from '@/constants/instruments'

import { SoundKeycap } from './SoundKeycap'

type InstrumentDetailProps = {
  instrument: Instrument
  index: number
  open: boolean
  /** 本屏是否处于当前页;离开乐器页时停掉试听音效。 */
  active: boolean
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

function InstrumentName({ name, playing }: { name: string; playing: boolean }) {
  return (
    <span className="inline-flex items-center gap-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
      <span className="inline-flex h-[1em] w-[1em] shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full" aria-hidden>
        <MorphIcon
          icon={playing ? Music4 : Music}
          strokeWidth={2}
          spring="snappy"
          reducedMotion="user"
        />
      </span>
      {name}
    </span>
  )
}

/**
 * AK-world broken chevron: a tall thick arrow whose upper arm is slice-cut
 * into a detached parallel piece (path lifted from the reference site's
 * icon sprite, viewBox 0 0 7 15, pointing right). `left` reuses the
 * reference site's own 180deg flip, so the slice lands on the bottom arm.
 */
function AkArrow({
  direction,
  className,
}: {
  direction: 'left' | 'right'
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 7 15"
      className={className}
      fill="currentColor"
      aria-hidden
      style={direction === 'left' ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path
        fillRule="evenodd"
        d="M-.005 14.988v-2.856l4.327-4.635 1.335-1.429L6.99 7.497l-6.995 7.491zm0-12.127V.005L4.322 4.64 2.989 6.068-.005 2.861z"
      />
    </svg>
  )
}

function RevealCopy({
  instrument,
  soundPlaying,
  onSoundToggle,
}: {
  instrument: Instrument
  soundPlaying: boolean
  onSoundToggle: () => void
}) {
  return (
    <>
      <div className="inst-reveal-mask">
        <span className="inst-reveal-item">
          <InstrumentName name={instrument.name} playing={soundPlaying} />
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
      {/* 不进遮罩:均衡条与音符特效会超出文字块边界。 */}
      <div className="inst-sound-reveal mt-5 sm:mt-6" style={{ animationDelay: '270ms' }}>
        <SoundKeycap playing={soundPlaying} onToggle={onSoundToggle} name={instrument.name} />
      </div>
    </>
  )
}

function SwapCopy({
  instrument,
  exiting,
  soundPlaying,
  onSoundToggle,
}: {
  instrument: Instrument
  exiting: boolean
  soundPlaying: boolean
  onSoundToggle: () => void
}) {
  const delays = exiting ? ['0ms', '60ms', '120ms', '160ms'] : ['0ms', '90ms', '180ms', '240ms']
  const item = exiting ? 'inst-swap-item inst-swap-out' : 'inst-swap-item inst-swap-in'
  return (
    <>
      <div className={item} style={{ animationDelay: delays[0] }}>
        <InstrumentName name={instrument.name} playing={soundPlaying} />
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
      <div className={`${item} mt-5 sm:mt-6`} style={{ animationDelay: delays[3] }}>
        <SoundKeycap playing={soundPlaying} onToggle={onSoundToggle} name={instrument.name} />
      </div>
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
  active,
  onStep,
  onJump,
  onClose,
  onOpenList,
}: InstrumentDetailProps) {
  const total = INSTRUMENTS.length
  const [shownId, setShownId] = useState(instrument.id)
  const [stage, setStage] = useState<CopyStage>('reveal')
  const sound = useInstrumentSound()
  const { stop: stopSound } = sound

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

  // 切换乐器、收起详情或翻离本屏时,立刻停掉试听音效。
  useEffect(() => {
    stopSound()
  }, [stopSound, instrument.id, open, active])

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
          <RevealCopy
            instrument={shown}
            soundPlaying={sound.playingId === shown.id}
            onSoundToggle={() => sound.toggle(shown.id, shown.sound)}
          />
        ) : (
          <SwapCopy
            instrument={shown}
            exiting={stage === 'exit'}
            soundPlaying={sound.playingId === shown.id}
            onSoundToggle={() => sound.toggle(shown.id, shown.sound)}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => onStep(-1)}
        aria-label="上一件乐器"
        className="absolute left-5 top-1/2 z-10 flex min-h-14 min-w-14 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white max-sm:top-[40%] sm:left-20"
      >
        <AkArrow direction="left" className="w-6 sm:w-7" />
      </button>
      <button
        type="button"
        onClick={() => onStep(1)}
        aria-label="下一件乐器"
        className="absolute right-5 top-1/2 z-10 flex min-h-14 min-w-14 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white max-sm:top-[40%] sm:right-20"
      >
        <AkArrow direction="right" className="w-6 sm:w-7" />
      </button>

      {/* 底栏：进度条吃掉按钮左侧的剩余宽度，桌面端右侧留给返回，互不重叠。 */}
      <div className="absolute inset-x-0 bottom-10 z-10 flex items-center max-sm:inset-x-5 max-sm:bottom-[max(2.5rem,env(safe-area-inset-bottom))] sm:right-6">
        <nav aria-label="乐器快速切换" className="relative flex h-10 min-w-0 flex-1">
          {/* 进度条与返回条同场编排:开详情时进度条自左向右展开(instruments.css),收起时原路收回。 */}
          <div aria-hidden className="inst-progress-clip absolute inset-0">
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/25" />
            <div
              className="absolute top-1/2 h-[10px] -translate-y-1/2 bg-accent transition-[left] duration-300"
              style={{ width: `${100 / total}%`, left: `${(index * 100) / total}%` }}
            />
          </div>
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

        {/* AK-world 返回条：贴右缘,左箭头 + 中英双行;配色走本站主题(instruments.css)。 */}
        <div className="inst-back -mr-6 hidden shrink-0 sm:block">
          <button type="button" className="inst-back-btn" onClick={onClose}>
            <AkArrow direction="left" className="inst-back-arrow" />
            <span className="inst-back-label">
              <span className="inst-back-zh">返回</span>
              <span className="inst-back-en">GO BACK</span>
            </span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenList}
        className="absolute bottom-[max(5.75rem,12vh)] right-5 z-10 min-h-11 border border-white/40 bg-ink/35 px-4 text-xs font-semibold tracking-widest text-white backdrop-blur-md sm:hidden"
      >
        查看列表
      </button>
    </div>
  )
}
