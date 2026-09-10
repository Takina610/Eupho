import type { Ref } from 'react'

type FullpageFooterProps = {
  ref: Ref<HTMLElement>
}

export function FullpageFooter({ ref }: FullpageFooterProps) {
  return (
    <footer
      ref={ref}
      className="flex min-h-[min(435px,70dvh)] flex-col justify-between bg-ink px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-12 pb-[max(3rem,env(safe-area-inset-bottom))] text-brand sm:px-8 sm:py-16"
    >
      <div>
        <p className="text-xs tracking-[0.18em] text-accent sm:text-sm sm:tracking-[0.28em]">北宇治高校吹奏乐部</p>
        <p className="mt-4 max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">吹响吧！上低音号</p>
        <p className="mt-3 max-w-xl text-sm text-brand sm:text-base">
          把各屏文案与素材替换成你的内容，即可变成正式落地页。
        </p>
      </div>
      <p className="text-xs tracking-wide text-brand/70">© {new Date().getFullYear()} eupho</p>
    </footer>
  )
}
