import { memo, useCallback, useEffect, useState } from 'react'
import { AccordionGallery } from '@/components/accordion-gallery/AccordionGallery'
import { IndexBackground } from '@/components/fullpage/IndexBackground'
import { useFullpageOverlayLock } from '@/components/fullpage/FullpagePagerContext'
import { Section } from '@/components/fullpage/Section'
import { SeriesDetailStage } from '@/components/series-detail/SeriesDetailStage'
import { SeriesStaff } from '@/components/series-staff/SeriesStaff'
import { SERIES_WORKS } from '@/constants/seriesCovers'
import type { SectionActiveProps } from '@/constants/homeSections'

const DEFAULT_SERIES_INDEX = 2

export const IndexSection = memo(function IndexSection({ active }: SectionActiveProps) {
  const setOverlayLock = useFullpageOverlayLock()
  const [activeIndex, setActiveIndex] = useState(DEFAULT_SERIES_INDEX)
  const [detailIndex, setDetailIndex] = useState<number | null>(null)
  // Flips as soon as the detail starts closing, so the scene restores while
  // the exit wipe plays instead of after it.
  const [detailClosing, setDetailClosing] = useState(false)

  useEffect(() => {
    setOverlayLock('series-detail', detailIndex != null)
    return () => setOverlayLock('series-detail', false)
  }, [detailIndex, setOverlayLock])

  const openDetail = useCallback((index: number) => {
    const work = SERIES_WORKS[index]
    if (work) {
      const preload = new Image()
      preload.src = work.portrait
    }
    setDetailClosing(false)
    setDetailIndex(index)
  }, [])

  const closeDetail = useCallback(() => setDetailClosing(true), [])

  const work = detailIndex != null ? SERIES_WORKS[detailIndex] : null
  const detailOpen = detailIndex != null
  const dimmed = detailOpen && !detailClosing

  return (
    <Section id="index" className="relative text-[#f2fafa]">
      <IndexBackground veiled={dimmed} />
      <h1 className="sr-only">吹响吧！上低音号</h1>
      <div className="relative flex min-h-0 w-full flex-1 flex-col">
        <AccordionGallery
          items={SERIES_WORKS}
          defaultIndex={DEFAULT_SERIES_INDEX}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          expandRatio={0.42}
          trigger="hover"
          height="100%"
          gap={8}
          radius={18}
          accentColor="#fff830"
          overlayColor="#021c21"
          textColor="#f2fafa"
          className="min-h-0 flex-1"
          recessed={detailOpen}
          dimmed={dimmed}
          onOpenActive={openDetail}
        />
        <SeriesStaff
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          onOpenActive={openDetail}
          recessed={detailOpen}
          dimmed={dimmed}
        />
      </div>
      {work ? (
        <SeriesDetailStage
          work={work}
          active={active}
          onClosing={closeDetail}
          onExited={() => {
            setDetailIndex(null)
            setDetailClosing(false)
          }}
        />
      ) : null}
    </Section>
  )
})
