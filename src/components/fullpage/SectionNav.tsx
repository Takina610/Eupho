type SectionNavProps = {
  labels: string[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function SectionNav({ labels, activeIndex, onSelect }: SectionNavProps) {
  return (
    <nav
      aria-label="全屏区块导航"
      className="fixed top-1/2 right-5 z-50 flex -translate-y-1/2 flex-col gap-3"
    >
      {labels.map((label, index) => {
        const isActive = index === activeIndex
        return (
          <button
            key={label}
            type="button"
            aria-label={`跳转到${label}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelect(index)}
            className={`h-2.5 w-2.5 rounded-full border border-white/70 transition ${
              isActive ? 'scale-125 bg-white' : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        )
      })}
    </nav>
  )
}
