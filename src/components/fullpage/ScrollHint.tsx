import { SCROLL_HINT_LOOP_MS } from '@/constants/fullpageMotion'

type ScrollHintProps = {
  isLast: boolean
}

export function ScrollHint({ isLast }: ScrollHintProps) {
  return (
    <div className="pointer-events-none absolute bottom-8 left-0 right-[237px] z-[4] flex justify-center">
      <p
        className="scroll-hint flex items-center gap-2 text-xs tracking-[0.35em] text-white/80 uppercase"
        style={{ animationDuration: `${SCROLL_HINT_LOOP_MS}ms` }}
      >
        Scroll
        <span aria-hidden className="text-base leading-none">
          {isLast ? '↑' : '↓'}
        </span>
      </p>
    </div>
  )
}
