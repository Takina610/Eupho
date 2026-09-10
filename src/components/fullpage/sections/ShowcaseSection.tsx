import { Section } from '@/components/fullpage/Section'

export function ShowcaseSection() {
  return (
    <Section id="showcase" className="bg-violet-950 text-white">
      <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-5xl">展示区</h2>
      <p className="max-w-xl text-center text-base text-violet-100/80 sm:text-lg">
        这里之后可以换成作品集、产品截图或交互 Demo。当前只保留一屏内能放下的占位内容。
      </p>
      <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {['滚轮切屏', '圆点导航', '键盘控制'].map((title) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-6 text-center"
          >
            <p className="text-sm font-medium tracking-wide">{title}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
