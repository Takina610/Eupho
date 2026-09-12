import type { Ref } from 'react'

import { SERIES_BANNERS } from '@/constants/seriesBanners'

type FullpageFooterProps = {
  ref: Ref<HTMLElement>
}

export function FullpageFooter({ ref }: FullpageFooterProps) {
  return (
    <footer
      ref={ref}
      className="flex min-h-[min(435px,70dvh)] items-center justify-center bg-ink px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:pt-16 sm:pb-16"
    >
      <ul className="grid w-fit grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-3 sm:gap-x-12 sm:gap-y-10">
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
