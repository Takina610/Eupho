import { useLenis } from 'lenis/react'
import { Section } from '@/components/fullpage/Section'

export function CtaSection() {
  const lenis = useLenis()

  return (
    <Section id="cta" className="bg-fuchsia-950 text-white">
      <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-5xl">准备开始</h2>
      <p className="mb-8 max-w-xl text-center text-base text-fuchsia-100/80 sm:text-lg">
        把各屏文案与素材替换成你的内容，即可变成正式落地页。
      </p>
      <button
        type="button"
        onClick={() => {
          const hero = document.getElementById('hero')
          if (!hero) {
            return
          }
          if (lenis) {
            lenis.scrollTo(hero, { offset: 0 })
          } else {
            hero.scrollIntoView({ behavior: 'smooth' })
          }
        }}
        className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-fuchsia-950 transition hover:bg-fuchsia-100"
      >
        回到顶部
      </button>
    </Section>
  )
}
