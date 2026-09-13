import { Suspense } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { BootGate, BootHold } from '@/components/loading/BootGate'
import { MenuButton } from '@/components/menu/MenuButton'
import '@/styles/app.css'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <BootGate>
      {/* 路由组件在 BootGate 之下仍可能悬挂（分块加载），兜底层与加载层同色 */}
      <Suspense fallback={<BootHold />}>
        <Outlet />
      </Suspense>
      <MenuButton />
    </BootGate>
  )
}
