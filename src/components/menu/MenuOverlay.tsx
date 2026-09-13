import type { MenuItemConfig } from '@/constants/homeSections'

type MenuOverlayProps = {
  open: boolean
  items: MenuItemConfig[]
  activeIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}

/**
 * 全局菜单浮层，样式对照 ak.hypergryph.com 移动端菜单：
 * 全屏深色遮罩 + 右上角下方的双行条目列表（EN 主标签 + 中文副标签）。
 * 常驻 DOM，靠 data-open 切换 visibility；条目自右向左 70ms 逐条交错，
 * 关闭时按反序收回（时间线倒放），细节见 menu.css。
 */
export function MenuOverlay({ open, items, activeIndex, onSelect, onClose }: MenuOverlayProps) {
  return (
    <div className="menu-overlay" data-open={open}>
      <div className="menu-scrim" aria-hidden="true" onClick={onClose} />
      <nav
        id="global-menu-panel"
        className="menu-panel"
        aria-label="站点菜单"
        style={{ '--menu-n': items.length } as React.CSSProperties}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="menu-item"
            data-current={index === activeIndex}
            style={{ '--i': index } as React.CSSProperties}
            onClick={() => onSelect(index)}
          >
            <span className="menu-item-en">{item.en}</span>
            <span className="menu-item-zh">{item.zh}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
