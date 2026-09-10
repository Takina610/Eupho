import { Reveal } from '@/components/fullpage/Reveal'
import { Section } from '@/components/fullpage/Section'

const SHOWCASE_CARDS = ['滚轮切屏', '圆点导航', '键盘控制'] as const

export function ShowcaseSection() {
  return (
    <Section id="showcase" className="bg-panel text-white">
      <Reveal index={0}>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-5xl">展示区</h2>
      </Reveal>
      <Reveal index={1}>
        <p className="max-w-xl px-2 text-center text-sm text-brand sm:text-lg">
          这里之后可以换成作品集、产品截图或交互 Demo。当前只保留一屏内能放下的占位内容。
        </p>
      </Reveal>
      <div className="mt-8 grid w-full max-w-3xl gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
        {SHOWCASE_CARDS.map((title, index) => (
          <Reveal key={title} index={index + 2}>
            <div className="rounded-2xl border border-brand/35 bg-ink/30 px-4 py-6 text-center">
              <p className="text-sm font-medium tracking-wide text-accent">{title}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
