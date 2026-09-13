import { memo, useState, type CSSProperties, type ReactNode } from 'react'

import { Section } from '@/components/fullpage/Section'
import type { SectionActiveProps } from '@/constants/homeSections'
import introArt from '@/assets/introduction/intro-img.webp'
import introArtSp from '@/assets/introduction/intro-img-sp.webp'

import './introductionSection.css'

/** 官网把标题逐字母拆进 span 做级联上浮，这里按同样的分组渲染（Intro / duction）。 */
const TITLE_PARTS = [
  ['I', 'n', 't', 'r', 'o'],
  ['d', 'u', 'c', 't', 'i', 'o', 'n'],
]

function IntroTitle({ sp = false }: { sp?: boolean }) {
  let letter = 0
  return (
    <div className={sp ? 'intro-title intro-title-sp' : 'intro-title'} aria-hidden={sp || undefined}>
      {!sp && <h2 className="sr-only">作品介绍 Introduction</h2>}
      <div className="intro-title-in">
        {TITLE_PARTS.map((part, partIndex) => (
          <p key={partIndex} className="intro-title-line">
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

/**
 * 段落双语：日文原文铺底，中文对照叠在同一格子里（容器取两版较高的高度，切换不跳动）。
 * 桌面悬浮整段淡入中文；移动端由右上角按钮统一切换。读屏只读当前生效的一版。
 */
function I18nText({
  className,
  zhOn,
  ja,
  zh,
}: {
  className?: string
  zhOn: boolean
  ja: ReactNode
  zh: ReactNode
}) {
  return (
    <p className={className}>
      <span className="intro-i18n">
        <span className="intro-i18n-ja" lang="ja" aria-hidden={zhOn || undefined}>
          {ja}
        </span>
        <span className="intro-i18n-zh" lang="zh-CN" aria-hidden={!zhOn || undefined}>
          {zh}
        </span>
      </span>
    </p>
  )
}

/** 官网 anime-eupho.com「Introduction」节的复刻：立绘 + 大标题 + 右侧文案栏。 */
export const IntroductionSection = memo(function IntroductionSection({
  active = false,
}: SectionActiveProps) {
  const [showZh, setShowZh] = useState(false)

  return (
    <Section id="introduction" className={`intro-stage${active ? ' on' : ''}${showZh ? ' zh' : ''}`}>
      <img src={introArt} alt="" className="intro-art" aria-hidden />
      <img src={introArtSp} alt="" className="intro-art-sp" aria-hidden />
      <IntroTitle />
      <button
        type="button"
        className="intro-lang-btn"
        aria-pressed={showZh}
        onClick={() => setShowZh((value) => !value)}
      >
        {showZh ? '日本語' : '中文'}
      </button>
      <div className="intro-panel">
        <IntroTitle sp />
        <div className="intro-inner">
          <div className="intro-txt">
            <I18nText
              className="intro-lead"
              zhOn={showZh}
              ja={
                <>
                  ついにシリーズ完結<span className="ls">！！！</span>
                  <br />
                  <span className="hl">この軌跡</span>が<span className="ls">、</span>
                  <span className="hl">次の曲</span>になる――
                </>
              }
              zh={
                <>
                  系列终于迎来完结<span className="ls">！！！</span>
                  <br />
                  <span className="hl">这份轨迹</span>，将成为<span className="hl">下一首曲子</span>
                  ——
                </>
              }
            />
            <I18nText
              className="intro-body"
              zhOn={showZh}
              ja={
                <>
                  吹奏楽部の10年分の青春が、劇場で完結を迎える。TV第3期でいったん幕を引いた北宇治高校吹奏楽部の物語が、「最終楽章」の名のもと、スクリーンで最後の楽曲を奏でる。
                </>
              }
              zh={
                <>
                  吹奏乐部十年的青春，即将在剧场迎来完结。曾在
                  TV第三期暂告一段落的北宇治高中吹奏乐部的故事，将以「最终乐章」之名，在银幕上奏响最后的乐曲。
                </>
              }
            />
            <I18nText
              className="intro-body"
              zhOn={showZh}
              ja={
                <>
                  総監督・石原立也、監督・小川太一が引き続き指揮を執り、シナリオは花田十輝が新たに執筆。TV版では描かれなかった演奏シーンを多数加えた、完結にふさわしい劇場作となっている。
                </>
              }
              zh={
                <>
                  总导演石原立也、导演小川太一继续执掌本作，剧本由花田十辉全新执笔，并加入大量
                  TV
                  版未曾描绘的演奏场面，是一部与「完结」之名相称的剧场作品。
                </>
              }
            />
            <I18nText
              className="intro-body"
              zhOn={showZh}
              ja={
                <>
                  胸に残るのは、あの日の誓い――。アニメ『響け！ユーフォニアム』ついに終幕へ。
                </>
              }
              zh={<>留在心中的，是那一天的誓言——动画《吹响吧！上低音号》，终于迎来终幕。</>}
            />
            <I18nText
              className="intro-release"
              zhOn={showZh}
              ja={
                <>
                  『最終楽章 響け！ユーフォニアム』後編は
                  <br />
                  2026年9月11日(金)公開！
                </>
              }
              zh={
                <>
                  《最终乐章 吹响吧！上低音号》后篇
                  <br />
                  2026年9月11日（周五）上映！
                </>
              }
            />
          </div>
        </div>
      </div>
    </Section>
  )
})
