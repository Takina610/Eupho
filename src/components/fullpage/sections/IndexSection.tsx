import { memo, useCallback, useEffect, useState } from 'react'
import { AccordionGallery } from '@/components/accordion-gallery/AccordionGallery'
import { IndexBackground } from '@/components/fullpage/IndexBackground'
import { useFullpageOverlayLock } from '@/components/fullpage/FullpagePagerContext'
import { Section } from '@/components/fullpage/Section'
import { SeriesDetailStage } from '@/components/series-detail/SeriesDetailStage'
import { SERIES_WORKS } from '@/constants/seriesCovers'

export const IndexSection = memo(function IndexSection() {
  const setOverlayLock = useFullpageOverlayLock()
  const [detailIndex, setDetailIndex] = useState<number | null>(null)
  // Flips as soon as the detail starts closing, so the scene restores while
  // the exit wipe plays instead of after it.
  const [detailClosing, setDetailClosing] = useState(false)

  useEffect(() => {
    setOverlayLock(detailIndex != null)
    return () => setOverlayLock(false)
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

  return (
    <Section id="index" className="relative text-[#f2fafa]">
      <IndexBackground veiled={detailIndex != null && !detailClosing} />
      <h1 className="sr-only">吹响吧！上低音号</h1>
      <div className="relative flex min-h-0 w-full flex-1">
        <AccordionGallery
          items={SERIES_WORKS}
          defaultIndex={2}
          expandRatio={0.42}
          trigger="hover"
          height="100%"
          gap={8}
          radius={18}
          accentColor="#fff830"
          overlayColor="#021c21"
          textColor="#f2fafa"
          className="min-h-0 flex-1"
          recessed={detailIndex != null}
          dimmed={detailIndex != null && !detailClosing}
          onOpenActive={openDetail}
        />
      </div>
      {work ? (
        <SeriesDetailStage
          work={work}
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
