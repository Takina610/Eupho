import { Reveal } from '@/components/fullpage/Reveal'
import { Section } from '@/components/fullpage/Section'

const SHOWCASE_CARDS = ['滚轮切屏', '圆点导航', '键盘控制'] as const

export function ShowcaseSection() {
  return (
    <Section id="showcase" className="bg-violet-950 text-white">
      <Reveal index={0}>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-5xl">展示区</h2>
      </Reveal>
      <Reveal index={1}>
        <p className="max-w-xl text-center text-base text-violet-100/80 sm:text-lg">
          这里之后可以换成作品集、产品截图或交互 Demo。当前只保留一屏内能放下的占位内容。
        </p>
      </Reveal>
      <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {SHOWCASE_CARDS.map((title, index) => (
          <Reveal key={title} index={index + 2}>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-6 text-center">
              <p className="text-sm font-medium tracking-wide">{title}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
