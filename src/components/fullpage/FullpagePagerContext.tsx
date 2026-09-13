import { createContext, memo, useContext, useMemo, type ReactNode } from 'react'
import type { GoToOptions } from '@/hooks/useFullpageHash'

type FullpagePagerActions = {
  goTo: (index: number, options?: GoToOptions) => void
  /** 按 key 声明浮层锁：同一 key 重复声明幂等，全部 key 释放后才恢复翻页。 */
  setOverlayLock: (key: string, locked: boolean) => void
}

type FullpagePagerState = {
  activeIndex: number
  /** 当前占用浮层锁的 key 集合（响应式），供菜单等按需显隐自身。 */
  overlayLockKeys: ReadonlySet<string>
  /** 谱线切页进行中（页脚揭示不算）。 */
  wiping: boolean
}

const FullpagePagerActionsContext = createContext<FullpagePagerActions | null>(null)
const FullpagePagerStateContext = createContext<FullpagePagerState | null>(null)

/**
 * 动作与状态拆成两个 Context：goTo/setOverlayLock 终身稳定，只有状态侧随切页
 * 翻转变化。否则仅声明浮层锁的区块（如首页）会在每次切页开始/结束时被拖着
 * 整树重渲染，memo 形同虚设。
 */
export const FullpagePagerProvider = memo(function FullpagePagerProvider({
  activeIndex,
  goTo,
  setOverlayLock,
  overlayLockKeys,
  wiping,
  children,
}: FullpagePagerActions & FullpagePagerState & { children: ReactNode }) {
  const actions = useMemo(() => ({ goTo, setOverlayLock }), [goTo, setOverlayLock])
  const state = useMemo(() => ({ activeIndex, overlayLockKeys, wiping }), [activeIndex, overlayLockKeys, wiping])
  return (
    <FullpagePagerActionsContext.Provider value={actions}>
      <FullpagePagerStateContext.Provider value={state}>
        {children}
      </FullpagePagerStateContext.Provider>
    </FullpagePagerActionsContext.Provider>
  )
})

function useFullpageActions() {
  const value = useContext(FullpagePagerActionsContext)
  if (!value) {
    throw new Error('Fullpage pager hooks must be used within FullpagePagerProvider')
  }
  return value
}

function useFullpageState() {
  const value = useContext(FullpagePagerStateContext)
  if (!value) {
    throw new Error('Fullpage pager hooks must be used within FullpagePagerProvider')
  }
  return value
}

export function useFullpageActiveIndex() {
  return useFullpageState().activeIndex
}

export function useFullpageOverlayLockKeys() {
  return useFullpageState().overlayLockKeys
}

export function useFullpageWiping() {
  return useFullpageState().wiping
}

export function useFullpageGoTo() {
  return useFullpageActions().goTo
}

export function useFullpageOverlayLock() {
  return useFullpageActions().setOverlayLock
}
