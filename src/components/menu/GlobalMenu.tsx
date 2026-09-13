import { useCallback, useEffect, useState } from 'react'
import {
  useFullpageActiveIndex,
  useFullpageGoTo,
  useFullpageOverlayLockKeys,
  useFullpageOverlayLock,
} from '@/components/fullpage/FullpagePagerContext'
import { MENU_ITEMS } from '@/constants/homeSections'
import { MenuButton } from '@/components/menu/MenuButton'
import { MenuOverlay } from '@/components/menu/MenuOverlay'
import './menu.css'

/**
 * 全局菜单：右上角圆形按钮 + 全屏菜单浮层的组合。
 * 打开时通过 setOverlayLock 冻结全屏翻页（键盘被锁、指针事件被浮层挡住）；
 * 点条目则先收菜单再 interrupt 跳转，让收起动画与谱线切页并行。
 * 系列详情等浮层开着时按钮隐藏，避免压住浮层自己的关闭按钮。
 */
export function GlobalMenu() {
  const [open, setOpen] = useState(false)
  const activeIndex = useFullpageActiveIndex()
  const goTo = useFullpageGoTo()
  const setOverlayLock = useFullpageOverlayLock()
  const overlayLockKeys = useFullpageOverlayLockKeys()
  // 菜单自己的锁不算数，只看「别的浮层」是否开着
  const otherOverlayOpen = [...overlayLockKeys].some((key) => key !== 'global-menu')

  useEffect(() => {
    setOverlayLock('global-menu', open)
  }, [open, setOverlayLock])

  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const select = useCallback(
    (index: number) => {
      setOpen(false)
      if (index !== activeIndex) {
        goTo(index, { interrupt: true })
      }
    },
    [activeIndex, goTo],
  )

  return (
    <>
      <MenuOverlay
        open={open}
        items={MENU_ITEMS}
        activeIndex={activeIndex}
        onSelect={select}
        onClose={toggle}
      />
      {!otherOverlayOpen && <MenuButton open={open} onToggle={toggle} />}
    </>
  )
}
