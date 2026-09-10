import euphoMark from '@/assets/eupho.webp'
import { Section } from '@/components/fullpage/Section'

export function HeroSection() {
  return (
    <Section id="hero" className="bg-slate-950 text-white">
      <img
        src={euphoMark}
        alt="eupho"
        className="mb-8 h-20 w-20 rounded-2xl object-cover shadow-lg shadow-violet-500/30"
      />
      <p className="mb-3 text-sm tracking-[0.35em] text-violet-300 uppercase">eupho</p>
      <h1 className="max-w-3xl text-center text-4xl font-semibold tracking-tight sm:text-6xl">
        顺滑全屏滚动体验
      </h1>
      <p className="mt-5 max-w-xl text-center text-base text-slate-300 sm:text-lg">
        Vite + React。滚轮一次切一屏，页面左右滑入。
      </p>
    </Section>
  )
}
