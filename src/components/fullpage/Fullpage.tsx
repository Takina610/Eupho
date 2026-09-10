import { useRef } from 'react'
import { SectionNav } from '@/components/fullpage/SectionNav'
import { HOME_SECTIONS } from '@/constants/homeSections'
import { useFullpageSnap } from '@/hooks/useFullpageSnap'

export function Fullpage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { activeIndex, goTo } = useFullpageSnap({ containerRef })

  return (
    <div ref={containerRef} className="relative">
      {HOME_SECTIONS.map(({ id, Component }) => (
        <Component key={id} />
      ))}
      <SectionNav
        labels={HOME_SECTIONS.map((section) => section.label)}
        activeIndex={activeIndex}
        onSelect={(index) => goTo(index)}
      />
    </div>
  )
}
