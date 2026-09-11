import type { CSSProperties } from 'react'
import type { Character } from '@/constants/characters'

export function CharacterThumb({
  active,
  item,
  onSelect,
}: {
  active: boolean
  item: Character
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={`cp__thumb${active ? ' is-active' : ''}`}
      aria-current={active ? true : undefined}
      aria-label={item.name}
      style={
        {
          '--cp-focus-x': `${item.focus[0]}%`,
          '--cp-focus-y': `${item.focus[1]}%`,
          '--cp-focus-scale': String(item.focus[2]),
        } as CSSProperties
      }
      onClick={onSelect}
    >
      <span className="cp__thumb-tab" aria-hidden />
      <span className="cp__thumb-mat" aria-hidden />
      <span className="cp__thumb-clip">
        <span className="cp__thumb-well">
          <span className="cp__thumb-figure">
            <img src={item.image} alt="" draggable={false} />
          </span>
        </span>
      </span>
      <span className="cp__thumb-name">{item.name}</span>
    </button>
  )
}
