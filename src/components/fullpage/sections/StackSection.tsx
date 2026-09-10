import { Section } from '@/components/fullpage/Section'

const STACK_ITEMS = [
  'Vite + React 19 + TypeScript',
  'Tailwind CSS v4',
  'TanStack Router',
  'Lenis + Snap (lock)',
] as const

export function StackSection() {
  return (
    <Section id="stack" className="bg-indigo-950 text-white">
      <h2 className="mb-8 text-3xl font-semibold tracking-tight sm:text-5xl">技术栈</h2>
      <ul className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {STACK_ITEMS.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm sm:text-base"
          >
            {item}
          </li>
        ))}
      </ul>
    </Section>
  )
}
