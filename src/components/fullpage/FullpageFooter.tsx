import type { Ref } from 'react'

type FullpageFooterProps = {
  ref: Ref<HTMLElement>
}

export function FullpageFooter({ ref }: FullpageFooterProps) {
  return (
    <footer
      ref={ref}
      className="flex min-h-[435px] flex-col justify-between bg-ink px-8 py-16 text-brand"
    >
      <div>
        <p className="text-sm tracking-[0.28em] text-accent">北宇治高校吹奏乐部</p>
        <p className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white">吹响吧！上低音号</p>
        <p className="mt-3 max-w-xl text-sm text-brand sm:text-base">
          把各屏文案与素材替换成你的内容，即可变成正式落地页。
        </p>
      </div>
      <p className="text-xs tracking-wide text-brand/70">© {new Date().getFullYear()} eupho</p>
    </footer>
  )
}
