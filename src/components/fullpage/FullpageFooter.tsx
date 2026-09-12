import type { Ref } from 'react'

import { SERIES_BANNERS } from '@/constants/seriesBanners'

type FullpageFooterProps = {
  ref: Ref<HTMLElement>
}

export function FullpageFooter({ ref }: FullpageFooterProps) {
  return (
    <footer
      ref={ref}
      className="relative flex min-h-[min(435px,70dvh)] items-center justify-center overflow-hidden bg-brand px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-14 pb-[max(3rem,env(safe-area-inset-bottom))] sm:pt-20 sm:pb-16"
    >
      {/* 官网同款巨型水印 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -inset-y-10 flex -rotate-6 select-none flex-col justify-center"
      >
        <p className="text-[clamp(5.5rem,16vw,15rem)] font-black leading-[0.92] tracking-tight text-white/15">
          Sound! Euphonium
        </p>
      </div>

      {/* 与上一屏的分隔：双黄线 */}
      <div aria-hidden className="absolute inset-x-0 top-0">
        <div className="h-[3px] bg-accent" />
        <div className="h-[9px]" />
        <div className="h-[20px] bg-accent" />
      </div>

      <ul className="relative grid w-fit grid-cols-3 items-center gap-x-6 gap-y-6 sm:gap-x-12 sm:gap-y-10">
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
