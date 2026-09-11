import coverS1 from '@/assets/covers/landscape/01-s1.jpg'
import coverWelcome from '@/assets/covers/landscape/02-movie-welcome-to-kitauji.jpg'
import coverS2 from '@/assets/covers/landscape/03-s2.jpg'
import coverMelody from '@/assets/covers/landscape/04-movie-todoketai-melody.jpg'
import coverLiz from '@/assets/covers/landscape/05-liz-and-the-blue-bird.jpg'
import coverFinale from '@/assets/covers/landscape/06-movie-chikai-no-finale.jpg'
import coverEnsemble from '@/assets/covers/landscape/07-special-ensemble-contest.jpg'
import coverS3 from '@/assets/covers/landscape/08-s3.jpg'
import coverFinalPart1 from '@/assets/covers/landscape/09-movie-final-chapter-part1.jpg'
import coverFinalPart2 from '@/assets/covers/landscape/10-movie-final-chapter-part2.jpg'
import portraitS1 from '@/assets/covers/portrait/01-s1.jpg'
import portraitWelcome from '@/assets/covers/portrait/02-movie-welcome-to-kitauji.jpg'
import portraitS2 from '@/assets/covers/portrait/03-s2.jpg'
import portraitMelody from '@/assets/covers/portrait/04-movie-todoketai-melody.jpg'
import portraitLiz from '@/assets/covers/portrait/05-liz-and-the-blue-bird.jpg'
import portraitFinale from '@/assets/covers/portrait/06-movie-chikai-no-finale.jpg'
import portraitEnsemble from '@/assets/covers/portrait/07-special-ensemble-contest.jpg'
import portraitS3 from '@/assets/covers/portrait/08-s3.jpg'
import portraitFinalPart1 from '@/assets/covers/portrait/09-movie-final-chapter-part1.jpg'
import portraitFinalPart2 from '@/assets/covers/portrait/10-movie-final-chapter-part2.jpg'

export type SeriesWork = {
  id: string
  image: string
  portrait: string
  label: string
  title: string
  alt: string
  kind: string
  year: string
  synopsis: string
  focusX?: number
}

export const SERIES_WORKS: SeriesWork[] = [
  {
    id: 's1',
    image: coverS1,
    portrait: portraitS1,
    label: '第一季',
    title: '吹响吧！上低音号',
    alt: '吹响吧！上低音号 第一季',
    kind: 'TV',
    year: '2015',
    focusX: 8,
    synopsis: '黄前久美子进入北宇治高校吹奏乐部，把「这次要认真」说出口。从这里开始，金管的光被重新对准全国大会。',
  },
  {
    id: 'welcome',
    image: coverWelcome,
    portrait: portraitWelcome,
    label: '欢迎来到北宇治',
    title: '剧场版 欢迎来到北宇治高中吹奏乐部',
    alt: '剧场版 欢迎来到北宇治高中吹奏乐部',
    kind: '剧场版',
    year: '2016',
    focusX: 8,
    synopsis: '第一季的剧场总集。把北宇治的一年重新铺开，当作走进这部作品的入口。',
  },
  {
    id: 's2',
    image: coverS2,
    portrait: portraitS2,
    label: '第二季',
    title: '吹响吧！上低音号 第二季',
    alt: '吹响吧！上低音号 第二季',
    kind: 'TV',
    year: '2016',
    focusX: 78,
    synopsis: '三年生引退之后，久美子成为上低音号声部的轴。选拔、新的队长，以及关西大会再次把认真摊在谱面上。',
  },
  {
    id: 'melody',
    image: coverMelody,
    portrait: portraitMelody,
    label: '想要传达的旋律',
    title: '剧场版 想要传达的旋律',
    alt: '剧场版 想要传达的旋律',
    kind: '剧场版',
    year: '2017',
    synopsis: '以高坂丽奈与加藤叶月为轴，补上第二季前后没有被吹完的那些音。想传达的，往往比旋律本身更难。',
  },
  {
    id: 'liz',
    image: coverLiz,
    portrait: portraitLiz,
    label: '利兹与青鸟',
    title: '利兹与青鸟',
    alt: '利兹与青鸟',
    kind: '剧场版',
    year: '2018',
    synopsis: '铠冢霙与伞木希美的故事。长笛与双簧管并排，依赖和毕业从吹奏乐部的侧面望出去。',
  },
  {
    id: 'finale',
    image: coverFinale,
    portrait: portraitFinale,
    label: '誓言的终章',
    title: '剧场版 誓言的终章',
    alt: '剧场版 誓言的终章',
    kind: '剧场版',
    year: '2019',
    synopsis: '久美子升上三年级。北宇治再次瞄准全国金奖，她得决定那句誓言要放在哪里。',
  },
  {
    id: 'ensemble',
    image: coverEnsemble,
    portrait: portraitEnsemble,
    label: '合奏比赛',
    title: '特别篇 合奏比赛',
    alt: '特别篇 合奏比赛',
    kind: '特别篇',
    year: '2023',
    synopsis: '第三季之前的特别篇。新的一年、新的位置，合奏比赛把部里的声音重新排好。',
  },
  {
    id: 's3',
    image: coverS3,
    portrait: portraitS3,
    label: '第三季',
    title: '吹响吧！上低音号 第三季',
    alt: '吹响吧！上低音号 第三季',
    kind: 'TV',
    year: '2024',
    synopsis: '久美子担任副部长。一年生、选拔，以及「什么才算认真」，被重新问了一次。',
  },
  {
    id: 'final-1',
    image: coverFinalPart1,
    portrait: portraitFinalPart1,
    label: '最终乐章 前篇',
    title: '剧场版 最终乐章 前篇',
    alt: '剧场版 最终乐章 前篇',
    kind: '剧场版',
    year: '2026',
    focusX: 10,
    synopsis: '三年级的最后一轮竞赛。前篇把北宇治送到决赛门口，曲子还没有结束。',
  },
  {
    id: 'final-2',
    image: coverFinalPart2,
    portrait: portraitFinalPart2,
    label: '最终乐章 后篇',
    title: '剧场版 最终乐章 后篇',
    alt: '剧场版 最终乐章 后篇',
    kind: '剧场版',
    year: '2026',
    focusX: 8,
    synopsis: '最后的一曲。后篇为从中学写到这里的故事收束，把金管的光送到终点。',
  },
]
