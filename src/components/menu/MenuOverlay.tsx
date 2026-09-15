import { useEffect, useState, type CSSProperties } from 'react'
import type { MenuItemConfig } from '@/constants/homeSections'

/** 背景大字的文案，逐字母交错出场。 */
const MENU_BG_WORDS = ['Sound!', 'Euphonium']
const MENU_BG_LETTER_COUNT = MENU_BG_WORDS.join('').length

/**
 * 双层逐字标签（官网 navTxt 同款机制）：每个字符是一个 overflow 裁剪窗口，
 * 窗口内的堆叠放着高亮拷贝（上）与白色拷贝（下），静止时堆叠停在 -100%
 * 露出白色；data-on 时堆叠滑到 0——高亮字符自上方滑入、白色字符向下滑出，
 * 每字延迟 li*35ms 从左到右次第播放；完整入场后退场按反序收回（时间线倒放），
 * 入场被打断则整排立即滑回，节奏见 menu.css。
 */
function MenuLabel({
  text,
  on,
  zh = false,
  mirrorExit,
}: {
  text: string
  on: boolean
  zh?: boolean
  mirrorExit: boolean
}) {
  return (
    <span
      className={zh ? 'menu-label menu-label--zh' : 'menu-label'}
      style={{ '--ln': text.length } as CSSProperties}
    >
      {text.split('').map((ch, i) => (
        <span key={i} className="menu-label-cell" style={{ '--li': i } as CSSProperties}>
          <span className="menu-label-size" aria-hidden="true">
            {ch}
          </span>
          <span
            className="menu-label-stack"
            data-on={on}
            data-exit={mirrorExit ? 'mirror' : 'snap'}
          >
            <span className="menu-label-copy menu-label-copy--hot" aria-hidden="true">
              {ch}
            </span>
            <span className="menu-label-copy">{ch}</span>
          </span>
        </span>
      ))}
    </span>
  )
}

/** 逐字入场步长 35ms 与过渡 0.26s 对应 menu.css 的 .menu-label-stack；末尾留余量。 */
const LABEL_SETTLE_BASE_MS = 300
const LABEL_STEP_MS = 35

type MenuOverlayProps = {
  open: boolean
  items: MenuItemConfig[]
  activeIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}

/**
 * 单条菜单栏：悬停/选中时英文与中文标签都播放逐字切换，
 * 行上方浮现单道谱线、下方浮现带加厚底线的谱段。
 * 谱线与热字符的退场是入场的倒放（颜色常驻 --staff 才有内容可退）；
 * 逐字退场仅在入场完整播完后走镜像反序，中途离开仍立即整排滑回。
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
  const [entered, setEntered] = useState(false)
  const settleMs = Math.max(item.en.length, item.zh.length) * LABEL_STEP_MS + LABEL_SETTLE_BASE_MS

  useEffect(() => {
    if (!hovered) {
      setEntered(false)
      return
    }
    const timer = window.setTimeout(() => setEntered(true), settleMs)
    return () => window.clearTimeout(timer)
  }, [hovered, settleMs])

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
        <MenuLabel text={item.en} on={on} mirrorExit={entered} />
        <MenuLabel text={item.zh} on={on} zh mirrorExit={entered} />
      </span>
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
