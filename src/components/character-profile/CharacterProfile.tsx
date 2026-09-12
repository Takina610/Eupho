import { useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { CHARACTERS } from '@/constants/characters'
import { CharacterThumb } from '@/components/character-profile/CharacterThumb'
import { fitWatermark } from '@/components/character-profile/characterSwitch'
import { useCharacterSelect } from '@/components/character-profile/useCharacterSelect'
import { useDragScroll } from '@/hooks/useDragScroll'
import '@/components/character-profile/CharacterProfile.css'
import '@/components/character-profile/characterCopy.css'
import '@/components/character-profile/characterThumbs.css'
import '@/components/character-profile/characterThumbs.mobile.css'

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

// nameEn is family-name-first (Oumae Kumiko); the watermark keeps showing the given name.
function watermarkOf(nameEn: string) {
  return (nameEn.split(' ').pop() ?? nameEn).toUpperCase()
}

function Chevron() {
  return (
    <svg className="cp__chevron" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 14.5 12 8.5 18 14.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

export function CharacterProfile() {
  const { character, count, index, select, stageRef, step, uniqueBackdrop } = useCharacterSelect()
  const watermarkRef = useRef<HTMLParagraphElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const { consumeDrag, ensureVisible } = useDragScroll({ progressRef, trackRef, viewportRef })
  const watermark = watermarkOf(character.nameEn)
  const fallbackClass = uniqueBackdrop ? '' : ' cp--fallback'

  useLayoutEffect(() => {
    const el = watermarkRef.current
    const stage = stageRef.current?.querySelector<HTMLElement>('.cp__stage') ?? el?.parentElement
    if (!el || !stage) {
      return
    }

    const fit = () => {
      if (stageRef.current?.classList.contains('is-switching')) {
        return
      }
      fitWatermark(el, stage)
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [stageRef, watermark])

  const revealStep = (delta: 1 | -1) => {
    ensureVisible(step(delta))
  }

  const onThumbsKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      event.stopPropagation()
      revealStep(1)
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      event.stopPropagation()
      revealStep(-1)
    }
  }

  return (
    <div ref={stageRef} className={`cp${fallbackClass}`}>
      <div className="cp__stage" aria-hidden>
        <div className="cp__backdrop" data-cp-layer="back">
          <img
            className="cp__backdrop-img"
            src={character.backdrop}
            alt=""
            draggable={false}
            style={
              {
                '--cp-back-x': `${character.back[0]}%`,
                '--cp-back-y': `${character.back[1]}%`,
                '--cp-back-scale': String(character.back[2]),
              } as CSSProperties
            }
          />
        </div>
        <p ref={watermarkRef} className="cp__watermark" data-cp-layer="main">
          {watermark}
        </p>
        <div className="cp__portrait" data-cp-layer="main">
          <img
            key={character.id}
            className="cp__portrait-img"
            src={character.image}
            alt={character.name}
            draggable={false}
          />
        </div>
      </div>

      <div className="cp__copy">
        <div className="cp__kicker">
          <p className="cp__kicker-path">KITAUJI BAND ://</p>
          <p className="cp__kicker-title">PROFILE</p>
        </div>
        <div className="cp__profile" data-cp-layer="copy">
          <div>
            <p className="cp__name-en">{character.nameEn}</p>
            <h2 className="cp__name">{character.name}</h2>
            <div className="cp__badges">
              <span className="cp__badge">{character.part}</span>
              <span className="cp__badge">{character.grade}</span>
            </div>
          </div>
          <div>
            <p className="cp__cv-label">CHARACTER VOICE</p>
            <p className="cp__cv">{character.cv}</p>
          </div>
          <p className="cp__synopsis">{character.synopsis}</p>
        </div>
        <div className="cp__thumbs" data-fullpage-ignore onKeyDown={onThumbsKey}>
          <div ref={viewportRef} className="cp__thumbs-viewport">
            <div ref={trackRef} className="cp__thumbs-track">
              {CHARACTERS.map((item, itemIndex) => (
                <CharacterThumb
                  key={item.id}
                  item={item}
                  active={itemIndex === index}
                  onSelect={() => {
                    if (!consumeDrag()) {
                      select(itemIndex)
                    }
                  }}
                />
              ))}
            </div>
          </div>
          <div ref={progressRef} className="cp__progress" aria-hidden>
            <span className="cp__progress-bar" />
          </div>
        </div>
      </div>

      <div className="cp__rail" data-fullpage-ignore onKeyDown={onThumbsKey}>
        <p className="cp__index-current">{pad2(index + 1)}</p>
        <span className="cp__index-rest">/ {pad2(count)}</span>
        <span className="cp__index-label">MEMBER</span>
        <button type="button" className="cp__nav cp__nav--prev" aria-label="上一位部员" onClick={() => revealStep(-1)}>
          <Chevron />
        </button>
        <button type="button" className="cp__nav cp__nav--next" aria-label="下一位部员" onClick={() => revealStep(1)}>
          <Chevron />
        </button>
      </div>
    </div>
  )
}
