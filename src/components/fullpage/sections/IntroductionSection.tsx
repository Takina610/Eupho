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
                  高校生たちの吹奏楽に懸ける青春を、10年の歩みで描いてきた『響け！ユーフォニアム』シリーズ。2024年に放送された第3期で物語は感動の最終回を迎え、その完結作となる“最終楽章”が、2026年、ついに劇場の幕を上げる。
                </>
              }
              zh={
                <>
                  《吹响吧！上低音号》描绘高中生倾注于吹奏乐的青春，至今已走过十年。2024
                  年播出的第三期中，故事迎来感人的最终回；其完结篇『最终乐章』将于 2026
                  年在剧场拉开帷幕。
                </>
              }
            />
            <I18nText
              className="intro-body"
              zhOn={showZh}
              ja={
                <>
                  総監督に名を連ねるのは、10年ものあいだ京都アニメーションの制作チームを牽引してきた石原立也。監督は、シリーズの中心をともに担ってきた小川太一が務める。
                </>
              }
              zh={
                <>
                  担任总导演的，是十年来始终引领京都动画制作团队的石原立也；导演则由一路共同支撑本系列的小川太一担当。
                </>
              }
            />
            <I18nText
              className="intro-body"
              zhOn={showZh}
              ja={
                <>
                  京都アニメーションによって本編カットは新たに磨き直され、シナリオは花田十輝の手による書き下ろし。新作シーンが多数加わり、TVシリーズでは描かれなかった演奏シーンまで収めた、『最終楽章』の名にふさわしい一作として届けられる。
                </>
              }
              zh={
                <>
                  京都动画将对正片镜头重新打磨，剧本由花田十辉全新执笔，在新增大量新制作场面的同时，还收录了
                  TV 版未曾描绘的演奏场景——是一部无愧于『最终乐章』之名的剧场作品。
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
