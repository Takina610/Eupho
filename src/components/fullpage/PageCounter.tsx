import { COUNTER_STAGGER_MS } from '@/constants/fullpageMotion'
import { HOME_SECTIONS } from '@/constants/homeSections'
import { RollingLine } from '@/components/fullpage/RollingLine'

type PageCounterProps = {
  index: number
  direction: 1 | -1
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function PageCounter({ index, direction }: PageCounterProps) {
  const display = pad(index + 1)
  const total = pad(HOME_SECTIONS.length)
  const code = HOME_SECTIONS[index]?.code ?? ''

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 right-0 z-[6] flex h-full w-[237px] flex-col items-start justify-center gap-3 px-7 text-white"
    >
      <RollingLine
        className="text-5xl font-semibold tracking-tight"
        delayMs={0}
        direction={direction}
        value={display}
      />
      <RollingLine
        className="text-sm tracking-widest text-white/70"
        delayMs={COUNTER_STAGGER_MS}
        direction={direction}
        value={`// ${display} / ${total}`}
      />
      <RollingLine
        className="text-xs tracking-[0.35em] text-white/80 uppercase"
        delayMs={COUNTER_STAGGER_MS * 2}
        direction={direction}
        value={code}
      />
    </div>
  )
}
