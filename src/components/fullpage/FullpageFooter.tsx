import type { Ref } from 'react'

type FullpageFooterProps = {
  ref: Ref<HTMLElement>
}

export function FullpageFooter({ ref }: FullpageFooterProps) {
  return (
    <footer
      ref={ref}
      className="flex min-h-[435px] flex-col justify-between bg-slate-950 px-8 py-16 text-slate-300"
    >
      <div>
        <p className="text-sm tracking-[0.35em] text-violet-300 uppercase">eupho</p>
        <p className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white">准备开始</p>
        <p className="mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
          把各屏文案与素材替换成你的内容，即可变成正式落地页。
        </p>
      </div>
      <p className="text-xs tracking-wide text-slate-500">© {new Date().getFullYear()} eupho</p>
    </footer>
  )
}
