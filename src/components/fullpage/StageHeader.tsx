import { HOME_SECTIONS } from '@/constants/homeSections'
import { useFullpageActiveIndex, useFullpageGoTo } from '@/components/fullpage/FullpagePagerContext'

export function StageHeader() {
  const activeIndex = useFullpageActiveIndex()
  const goTo = useFullpageGoTo()

  return (
    <header className="absolute top-0 right-[237px] left-0 z-[23] flex h-[152px] items-center justify-between px-8 text-white">
      <p className="text-sm tracking-[0.35em] text-white/80 uppercase">eupho</p>
      <nav className="flex gap-6 text-sm">
        {HOME_SECTIONS.map((section, index) => (
          <button
            key={section.id}
            type="button"
            onClick={() => goTo(index)}
            className={`tracking-wide uppercase transition ${
              index === activeIndex ? 'text-white' : 'text-white/45 hover:text-white/80'
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
