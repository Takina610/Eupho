import { useCallback, useEffect, useState } from 'react'
import {
  useFullpageActiveIndex,
  useFullpageGoTo,
  useFullpageOverlayLockKeys,
  useFullpageOverlayLock,
  useFullpageWiping,
} from '@/components/fullpage/FullpagePagerContext'
import { MENU_ITEMS } from '@/constants/homeSections'
import { MenuButton } from '@/components/menu/MenuButton'
import { MenuOverlay } from '@/components/menu/MenuOverlay'
import './menu.css'

/**
 * 全局菜单：右上角圆形按钮 + 全屏菜单浮层的组合。
 * 打开时通过 setOverlayLock 冻结全屏翻页（键盘被锁、指针事件被浮层挡住）；
 * 点条目则先收菜单再 interrupt 跳转，让收起动画与谱线切页并行。
 * 其他浮层（系列详情等）开着时按钮隐藏；每次谱线切页按钮缩小再放大，
 * 页脚揭示（不触发谱线）不参与，细节见 menu.css 与 GlobalMenu 的挂载时序。
 */
export function GlobalMenu() {
  const [open, setOpen] = useState(false)
  const activeIndex = useFullpageActiveIndex()
  const goTo = useFullpageGoTo()
  const setOverlayLock = useFullpageOverlayLock()
  const overlayLockKeys = useFullpageOverlayLockKeys()
  const wiping = useFullpageWiping()
  // 菜单自己的锁不算数；切页进行中按钮同样要让位
  const hidden = wiping || [...overlayLockKeys].some((key) => key !== 'global-menu')
  // 按钮随切页/浮层开合缩放出入场：退出动画播完才卸载；
  // 重挂载时先以缩小态入画，稍后翻到放大态，保证生长动画真正播放。
  const [btnMounted, setBtnMounted] = useState(!hidden)
  const [btnReady, setBtnReady] = useState(false)

  useEffect(() => {
    if (!hidden) {
      setBtnMounted(true)
      return
    }
    const timer = window.setTimeout(() => setBtnMounted(false), 400)
    return () => window.clearTimeout(timer)
  }, [hidden])

  useEffect(() => {
    if (!btnMounted) {
      setBtnReady(false)
      return
    }
    // 不能用 rAF：标签页被遮挡时 rAF 停摆会导致永远停在缩小态
    const timer = window.setTimeout(() => setBtnReady(true), 60)
    return () => window.clearTimeout(timer)
  }, [btnMounted])

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
      {btnMounted && <MenuButton open={open} onToggle={toggle} show={!hidden && btnReady} />}
    </>
  )
}
