import { Outlet, createRootRoute } from '@tanstack/react-router'
import { BootGate } from '@/components/loading/BootGate'
import '@/styles/app.css'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <BootGate>
      <Outlet />
    </BootGate>
  )
}
