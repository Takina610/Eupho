import { Outlet, createRootRoute } from '@tanstack/react-router'
import { LenisProvider } from '@/components/lenis/LenisProvider'
import '@/styles/app.css'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <LenisProvider>
      <Outlet />
    </LenisProvider>
  )
}
