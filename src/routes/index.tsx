import { createFileRoute } from '@tanstack/react-router'
import { Fullpage } from '@/components/fullpage/Fullpage'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <Fullpage />
}
