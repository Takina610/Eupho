import { AccordionGallery } from '@/components/accordion-gallery/AccordionGallery'
import { IndexBackground } from '@/components/fullpage/IndexBackground'
import { Section } from '@/components/fullpage/Section'
import { SERIES_COVERS } from '@/constants/seriesCovers'

export function IndexSection() {
  return (
    <Section id="index" className="relative text-[#f2fafa]">
      <IndexBackground />
      <h1 className="sr-only">吹响吧！上低音号</h1>
      <div className="relative flex min-h-0 w-full flex-1">
        <AccordionGallery
          items={SERIES_COVERS}
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
        />
      </div>
    </Section>
  )
}
