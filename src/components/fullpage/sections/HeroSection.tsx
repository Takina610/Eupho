import euphoMark from '@/assets/eupho.webp'
import { Reveal } from '@/components/fullpage/Reveal'
import { Section } from '@/components/fullpage/Section'

export function HeroSection() {
  return (
    <Section id="hero" className="bg-slate-950 text-white">
      <Reveal index={0}>
        <img
          src={euphoMark}
          alt="eupho"
          className="mb-8 h-20 w-20 rounded-2xl object-cover shadow-lg shadow-violet-500/30"
        />
      </Reveal>
      <Reveal index={1}>
        <p className="mb-3 text-sm tracking-[0.35em] text-violet-300 uppercase">eupho</p>
      </Reveal>
      <Reveal index={2}>
        <h1 className="max-w-3xl text-center text-4xl font-semibold tracking-tight sm:text-6xl">
          顺滑全屏滚动体验
        </h1>
      </Reveal>
      <Reveal index={3}>
        <p className="mt-5 max-w-xl text-center text-base text-slate-300 sm:text-lg">
          Vite + React。滚轮一次切一屏，接缝擦除切换。
        </p>
      </Reveal>
    </Section>
  )
}
