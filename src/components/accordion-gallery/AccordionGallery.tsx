import { useState, type CSSProperties, type MouseEvent } from 'react'
import { useAccordionGalleryLayout } from '@/components/accordion-gallery/useAccordionGalleryLayout'
import { useMatchMedia } from '@/hooks/useMatchMedia'
import '@/components/accordion-gallery/AccordionGallery.css'

const STACK_QUERY = '(max-width: 640px)'

export type AccordionGalleryItem = {
  image: string
  label?: string
  link?: string
  alt?: string
  /** Horizontal focal point for `object-fit: cover`, 0 = left, 100 = right. */
  focusX?: number
}

type AccordionGalleryProps = {
  items: AccordionGalleryItem[]
  defaultIndex?: number
  accentColor?: string
  overlayColor?: string
  textColor?: string
  height?: number | string
  gap?: number
  radius?: number
  expandRatio?: number
  orientation?: 'horizontal' | 'vertical'
  duration?: number
  ease?: string
  parallax?: number
  tilt?: number
  stagger?: number
  trigger?: 'hover' | 'click'
  showLabels?: boolean
  grayscale?: boolean
  className?: string
}

export function AccordionGallery({
  items,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
}: AccordionGalleryProps) {
  const stackOnNarrow = useMatchMedia(STACK_QUERY)
  const vertical = orientation === 'vertical' || stackOnNarrow
  const count = items.length
  const [active, setActive] = useState(() => Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)))
  const { rootRef, panelRefs, mediaRefs, barRefs, textRefs } = useAccordionGalleryLayout({
    active,
    count,
    expandRatio,
    duration,
    ease,
    vertical,
    tilt,
    parallax,
    grayscale,
    showLabels,
    stagger,
    gap,
  })

  const heightStyle = typeof height === 'number' ? `${vertical ? Math.round(height * 1.6) : height}px` : height

  const handleEnter = (index: number) => {
    if (trigger === 'hover') {
      setActive(index)
    }
  }

  const handleClick = (index: number, event: MouseEvent<HTMLElement>) => {
    if (index !== active) {
      event.preventDefault()
      setActive(index)
    }
  }

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={
        {
          '--ag-accent': accentColor,
          '--ag-overlay': overlayColor,
          '--ag-text': textColor,
          '--ag-gap': `${gap}px`,
          '--ag-radius': `${radius}px`,
          height: heightStyle,
        } as CSSProperties
      }
      role="list"
      aria-label="系列作品"
    >
      {items.map((item, index) => {
        const isActive = index === active
        const Tag = item.link ? 'a' : 'div'

        return (
          <Tag
            key={item.image}
            ref={(el: HTMLElement | null) => {
              panelRefs.current[index] = el
            }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={(event: MouseEvent<HTMLElement>) => handleClick(index, event)}
            onMouseEnter={() => handleEnter(index)}
            onFocus={() => setActive(index)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(el) => {
                  mediaRefs.current[index] = el
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  draggable={false}
                  style={{ objectPosition: `${item.focusX ?? 50}% 50%` }}
                />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels ? (
              <span className="ag-panel__label" aria-hidden="true">
                <span
                  className="ag-panel__bar"
                  ref={(el) => {
                    barRefs.current[index] = el
                  }}
                />
                <span
                  className="ag-panel__text"
                  ref={(el) => {
                    textRefs.current[index] = el
                  }}
                >
                  {item.label}
                </span>
              </span>
            ) : null}
          </Tag>
        )
      })}
    </div>
  )
}
