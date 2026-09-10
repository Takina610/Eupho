import euphoMark from '@/assets/eupho.webp'
import { Reveal } from '@/components/fullpage/Reveal'
import { Section } from '@/components/fullpage/Section'

export function HeroSection() {
  return (
    <Section id="hero" className="bg-ink text-white">
      <Reveal index={0}>
        <img
          src={euphoMark}
          alt="上低音号"
          className="mb-8 h-20 w-20 rounded-2xl object-cover ring-2 ring-accent shadow-[0_16px_48px_rgba(1,172,198,0.45)]"
        />
      </Reveal>
      <Reveal index={1}>
        <p className="mb-3 px-2 text-center text-xs tracking-[0.18em] text-accent sm:text-sm sm:tracking-[0.28em]">
          北宇治高校吹奏乐部
        </p>
      </Reveal>
      <Reveal index={2}>
        <h1 className="max-w-3xl px-2 text-center text-[clamp(1.75rem,8vw,3.75rem)] font-semibold tracking-tight">
          吹响吧！上低音号
        </h1>
      </Reveal>
      <Reveal index={3}>
        <p className="mt-5 max-w-xl px-2 text-center text-sm text-brand sm:text-lg">
          金管的光，从这里翻页开始。
        </p>
      </Reveal>
    </Section>
  )
}
