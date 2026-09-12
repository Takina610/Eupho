import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { BootHold } from '@/components/loading/BootGate'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  // 首次匹配在等懒加载路由分块时，先铺一层与加载层同色的兜底，
  // 否则静态加载壳被清掉后会闪出深色 body
  defaultPendingComponent: BootHold,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
