import { Reveal } from '@/components/fullpage/Reveal'
import { Section } from '@/components/fullpage/Section'

const STACK_ITEMS = [
  'Vite + React 19 + TypeScript',
  'Tailwind CSS v4',
  'TanStack Router',
  'Lenis + Snap (lock)',
] as const

export function StackSection() {
  return (
    <Section id="stack" className="bg-deep text-white">
      <Reveal index={0}>
        <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:mb-8 sm:text-5xl">技术栈</h2>
      </Reveal>
      <ul className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {STACK_ITEMS.map((item, index) => (
          <li key={item}>
            <Reveal index={index + 1}>
              <div className="rounded-2xl border border-brand/35 bg-brand/10 px-4 py-3.5 text-sm sm:px-5 sm:py-4 sm:text-base">
                {item}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
