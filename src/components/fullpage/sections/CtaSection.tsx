import { memo, type CSSProperties } from 'react'

import { Section } from '@/components/fullpage/Section'
import type { SectionActiveProps } from '@/constants/homeSections'
import introArt from '@/assets/introduction/intro-img.webp'
import introArtSp from '@/assets/introduction/intro-img-sp.webp'

import './ctaSection.css'

/** 官网把标题逐字母拆进 span 做级联上浮，这里按同样的分组渲染（Intro / duction）。 */
const TITLE_PARTS = [
  ['I', 'n', 't', 'r', 'o'],
  ['d', 'u', 'c', 't', 'i', 'o', 'n'],
]

function CtaTitle({ sp = false }: { sp?: boolean }) {
  let letter = 0
  return (
    <div className={sp ? 'cta-title cta-title-sp' : 'cta-title'} aria-hidden={sp || undefined}>
      {!sp && <h2 className="sr-only">作品介绍 Introduction</h2>}
      <div className="cta-title-in">
        {TITLE_PARTS.map((part, partIndex) => (
          <p key={partIndex} className="cta-title-line">
            {part.map((char) => (
              <span key={`${char}-${letter}`} style={{ '--letter': letter++ } as CSSProperties}>
                {char}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  )
}

/** 官网 anime-eupho.com「Introduction」节的复刻：立绘 + 大标题 + 右侧文案栏。 */
export const CtaSection = memo(function CtaSection({ active = false }: SectionActiveProps) {
  return (
    <Section id="cta" className={`cta-stage${active ? ' on' : ''}`}>
      <img src={introArt} alt="" className="cta-art" aria-hidden />
      <img src={introArtSp} alt="" className="cta-art-sp" aria-hidden />
      <CtaTitle />
      <div className="cta-panel">
        <CtaTitle sp />
        <div className="cta-inner">
          <div className="cta-txt">
            <p className="cta-lead">
              ついにシリーズ完結<span className="ls">！！！</span>
              <br />
              <span className="hl">この軌跡</span>が<span className="ls">、</span>
              <span className="hl">次の曲</span>になる――
            </p>
            <p className="cta-body">
              吹奏楽部の10年分の青春が、劇場で完結を迎える。TV第3期でいったん幕を引いた北宇治高校吹奏楽部の物語が、「最終楽章」の名のもと、スクリーンで最後の楽曲を奏でる。
            </p>
            <p className="cta-body">
              総監督・石原立也、監督・小川太一が引き続き指揮を執り、シナリオは花田十輝が新たに執筆。TV版では描かれなかった演奏シーンを多数加えた、完結にふさわしい劇場作となっている。
            </p>
            <p className="cta-body">
              胸に残るのは、あの日の誓い――。アニメ『響け！ユーフォニアム』ついに終幕へ。
            </p>
            <p className="cta-release">
              『最終楽章 響け！ユーフォニアム』後編は
              <br />
              2026年9月11日(金)公開！
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
})
