import { Reveal } from '@/components/fullpage/Reveal'
import { Section } from '@/components/fullpage/Section'
import { useFullpageGoTo } from '@/components/fullpage/FullpagePagerContext'

export function CtaSection() {
  const goTo = useFullpageGoTo()

  return (
    <Section id="cta" className="bg-fuchsia-950 text-white">
      <Reveal index={0}>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-5xl">准备开始</h2>
      </Reveal>
      <Reveal index={1}>
        <p className="mb-8 max-w-xl text-center text-base text-fuchsia-100/80 sm:text-lg">
          把各屏文案与素材替换成你的内容，即可变成正式落地页。
        </p>
      </Reveal>
      <Reveal index={2}>
        <button
          type="button"
          onClick={() => goTo(0)}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-fuchsia-950 transition hover:bg-fuchsia-100"
        >
          回到首页
        </button>
      </Reveal>
    </Section>
  )
}
