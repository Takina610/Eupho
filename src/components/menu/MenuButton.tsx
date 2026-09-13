import euphoIcon from '@/assets/eupho.webp'

/**
 * 全局右上角的圆形 Menu 徽标，样式对照官网 anime-eupho.com 的 .nav-btn：
 * 青色圆底 + 内嵌 4px 白色 outline 细环，居中上低音号图标 + 底部 Menu 字样。
 * 点开交互后续再做，当前仅作为固定入口占位。
 */
export function MenuButton() {
  return (
    <button
      type="button"
      aria-label="菜单"
      className="fixed top-[max(3%,env(safe-area-inset-top))] right-[max(3%,env(safe-area-inset-right))] z-50 h-[clamp(4.375rem,0.857rem+6.74vw,6.25rem)] w-[clamp(4.375rem,0.857rem+6.74vw,6.25rem)] cursor-pointer touch-manipulation rounded-full bg-brand text-accent outline-4 outline-solid outline-white outline-offset-[-6px] select-none focus-visible:brightness-110 sm:top-[30px] sm:right-[30px] sm:outline-offset-[-7px]"
    >
      <img
        src={euphoIcon}
        alt=""
        draggable={false}
        className="absolute top-[calc(50%-5px)] left-1/2 h-auto w-[clamp(2rem,0.827rem+2.25vw,2.625rem)] -translate-x-1/2 -translate-y-1/2"
      />
      <span className="absolute inset-x-0 bottom-[clamp(0.875rem,0.406rem+0.9vw,1.125rem)] text-center text-[clamp(0.438rem,-0.149rem+1.12vw,0.75rem)] leading-none font-semibold">
        Menu
      </span>
    </button>
  )
}
