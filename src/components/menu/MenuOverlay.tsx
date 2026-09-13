import { useState } from 'react'
import type { MenuItemConfig } from '@/constants/homeSections'
import { useScramble } from '@/components/menu/useScramble'

/** 背景大字的文案，逐字母交错出场。 */
const MENU_BG_WORDS = ['Sound!', 'Euphonium']
const MENU_BG_LETTER_COUNT = MENU_BG_WORDS.join('').length

type MenuOverlayProps = {
  open: boolean
  items: MenuItemConfig[]
  activeIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}

/**
 * 单条菜单栏：悬停时英文字符播放切换效果（useScramble），
 * 行上下浮现五线谱（menu.css 的 ::before），配色随悬浮/选中状态区分。
 */
function MenuItem({ item, index, current, onSelect }: {
  item: MenuItemConfig
  index: number
  current: boolean
  onSelect: (index: number) => void
}) {
  const [hovered, setHovered] = useState(false)
  const display = useScramble(item.en, hovered)
  return (
    <button
      type="button"
      className="menu-item"
      data-current={current}
      style={{ '--i': index } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => onSelect(index)}
    >
      <span className="menu-item-en">{display}</span>
      <span className="menu-item-zh">{item.zh}</span>
    </button>
  )
}

/**
 * 全局菜单浮层，样式对照 ak.hypergryph.com 移动端菜单：
 * 全屏深色遮罩 + 右上角下方的双行条目列表（EN 主标签 + 中文副标签）。
 * 常驻 DOM，靠 data-open 切换 visibility；条目自右向左 70ms 逐条交错，
 * 背景大字以字母为单位交错出现/退场，细节见 menu.css。
 */
export function MenuOverlay({ open, items, activeIndex, onSelect, onClose }: MenuOverlayProps) {
  let letterIndex = -1
  return (
    <div className="menu-overlay" data-open={open}>
      <button type="button" className="menu-scrim" aria-hidden="true" onClick={onClose}>
        <span
          className="menu-bg-word"
          aria-hidden="true"
          style={{ '--n': MENU_BG_LETTER_COUNT } as React.CSSProperties}
        >
          {MENU_BG_WORDS.map((word) => (
            <span className="menu-bg-line" key={word}>
              {word.split('').map((ch) => {
                letterIndex += 1
                return (
                  <span
                    key={letterIndex}
                    className="menu-bg-char"
                    style={{ '--ci': letterIndex } as React.CSSProperties}
                  >
                    {ch}
                  </span>
                )
              })}
            </span>
          ))}
        </span>
      </button>
      <nav
        id="global-menu-panel"
        className="menu-panel"
        aria-label="站点菜单"
        style={{ '--menu-n': items.length } as React.CSSProperties}
      >
        {items.map((item, index) => (
          <MenuItem
            key={item.id}
            item={item}
            index={index}
            current={index === activeIndex}
            onSelect={onSelect}
          />
        ))}
      </nav>
    </div>
  )
}
