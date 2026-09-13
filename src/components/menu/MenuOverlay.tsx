import { useState, type CSSProperties } from 'react'
import type { MenuItemConfig } from '@/constants/homeSections'

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
 * 双层逐字标签：data-on 翻转时，底层原样式字符从左往右逐字向下掉，
 * 上层高亮样式（青/黄斜体，见 menu.css 的 --staff）自上方逐字落下补位。
 * 拆成单字 span 仅供动画，可读性由按钮的 aria-label 保证。
 */
function MenuLabel({ text, on, zh = false }: { text: string; on: boolean; zh?: boolean }) {
  return (
    <span className={zh ? 'menu-label menu-label--zh' : 'menu-label'} data-on={on}>
      {text.split('').map((ch, i) => (
        <span key={i} className="menu-label-cell" style={{ '--li': i } as CSSProperties}>
          <span className="menu-label-base">{ch}</span>
          <span className="menu-label-alt" aria-hidden="true">
            {ch}
          </span>
        </span>
      ))}
    </span>
  )
}

/**
 * 单条菜单栏：悬停/选中时英文与中文标签都播放逐字下落切换，
 * 行上下浮现五线谱（上谱自上方滑出、下谱自下方滑出，底谱线更厚）。
 */
function MenuItem({
  item,
  index,
  current,
  onSelect,
}: {
  item: MenuItemConfig
  index: number
  current: boolean
  onSelect: (index: number) => void
}) {
  const [hovered, setHovered] = useState(false)
  const on = hovered || current
  return (
    <button
      type="button"
      className="menu-item"
      data-current={current}
      data-hot={hovered}
      aria-label={`${item.en} ${item.zh}`}
      style={{ '--i': index } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => onSelect(index)}
    >
      <span className="menu-labels" aria-hidden="true">
        <MenuLabel text={item.en} on={on} />
        <MenuLabel text={item.zh} on={on} zh />
      </span>
      <span className="menu-item-tab" aria-hidden="true" />
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
          style={{ '--n': MENU_BG_LETTER_COUNT } as CSSProperties}
        >
          {MENU_BG_WORDS.map((word) => (
            <span className="menu-bg-line" key={word}>
              {word.split('').map((ch) => {
                letterIndex += 1
                return (
                  <span
                    key={letterIndex}
                    className="menu-bg-char"
                    style={{ '--ci': letterIndex } as CSSProperties}
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
        style={{ '--menu-n': items.length } as CSSProperties}
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
