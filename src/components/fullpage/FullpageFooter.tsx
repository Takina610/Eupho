import type { Ref } from 'react'

import storyBgOnp from '@/assets/story-bg-onp.webp'
import { SERIES_BANNERS } from '@/constants/seriesBanners'

type FullpageFooterProps = {
  ref: Ref<HTMLElement>
}

export function FullpageFooter({ ref }: FullpageFooterProps) {
  return (
    <footer
      ref={ref}
      className="relative flex min-h-[min(435px,70dvh)] items-center justify-center overflow-hidden bg-brand px-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pt-14 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-20 sm:pb-16"
    >
      {/* 金色音符背景素材 */}
      <img
        aria-hidden
        src={storyBgOnp}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* 官网同款巨型水印：靠右、从左上到右下倾斜 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -inset-y-10 flex rotate-6 select-none flex-col justify-start pt-6 sm:justify-center sm:pt-0"
      >
        <p className="-mr-[6%] text-right text-[31vw] font-black leading-[0.9] tracking-tight text-white/15 sm:mr-0 sm:text-[clamp(5.5rem,16vw,15rem)]">
          Sound! Euphonium
        </p>
      </div>

      {/* 与上一屏的分隔：双黄线 */}
      <div aria-hidden className="absolute inset-x-0 top-0">
        <div className="h-[3px] bg-accent" />
        <div className="h-[9px]" />
        <div className="h-[20px] bg-accent" />
      </div>

      <ul className="relative grid w-fit grid-cols-3 items-center gap-x-2 gap-y-4 sm:gap-x-12 sm:gap-y-10">
        {SERIES_BANNERS.map((banner) => (
          <li key={banner.href}>
            <a
              href={banner.href}
              target="_blank"
              rel="noreferrer"
              className="block transition-opacity hover:opacity-75 focus-visible:opacity-75"
            >
              <img
                src={banner.src}
                alt={banner.alt}
                width={240}
                height={60}
                loading="lazy"
                className="h-auto w-[240px] max-w-full"
              />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
