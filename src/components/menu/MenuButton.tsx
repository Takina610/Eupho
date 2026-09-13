import euphoIcon from '@/assets/eupho.webp'

type MenuButtonProps = {
  open: boolean
  onToggle: () => void
}

/**
 * 全局右上角的圆形 Menu 徽标，样式对照官网 anime-eupho.com 的 .nav-btn：
 * 青色圆底 + 内嵌 4px 白色 outline 细环，居中上低音号图标 + Menu/Close 字样。
 * 打开时图标用非线性缓动转一圈（menu.css 的 rotate 过渡），文字切换为 Close。
 */
export function MenuButton({ open, onToggle }: MenuButtonProps) {
  return (
    <button
      type="button"
      aria-label={open ? '关闭菜单' : '打开菜单'}
      aria-expanded={open}
      aria-controls="global-menu-panel"
      onClick={onToggle}
      className="fixed top-[max(3vw,env(safe-area-inset-top))] right-[max(3vw,env(safe-area-inset-right))] z-[60] h-[clamp(4.375rem,0.857rem+6.74vw,6.25rem)] w-[clamp(4.375rem,0.857rem+6.74vw,6.25rem)] cursor-pointer touch-manipulation rounded-full bg-brand text-accent outline-4 outline-solid outline-white outline-offset-[-6px] select-none focus-visible:brightness-110 sm:top-[30px] sm:right-[30px] sm:outline-offset-[-7px]"
    >
      <span aria-hidden="true" className="absolute inset-[7%] rounded-full border-2 border-white/95" />
      <span className="relative flex flex-col items-center gap-[3px]">
        <img
          src={euphoIcon}
          alt=""
          draggable={false}
          className="menu-btn-icon absolute top-[calc(50%-5px)] left-1/2 h-auto w-[clamp(2rem,0.827rem+2.25vw,2.625rem)] -translate-x-1/2 -translate-y-1/2"
        />
        <span className="text-[clamp(0.438rem,-0.149rem+1.12vw,0.75rem)] leading-none font-semibold">
          {open ? 'Close' : 'Menu'}
        </span>
      </span>
    </button>
  )
}
