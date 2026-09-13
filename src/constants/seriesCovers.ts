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
    label: '吹响吧！上低音号',
    title: '吹响吧！上低音号',
    alt: '吹响吧！上低音号',
    kind: 'TV',
    year: '2015',
    focusX: 8,
    synopsis:
      '进入北宇治高中就读的主人公黄前久美子，在同班同学加藤叶月的热烈影响下加入了该校的吹奏部。北宇治高中吹奏部直到五年前还是关西大会的常客，并且过去还是全国大会出场过的强校代表，然而自从顾问换了之后，该吹奏部就再也没有挺进过关西大会。之后以新顾问的赴任为契机，怀揣着高远目标的部员们挥洒着奋斗的青春，过着波澜万丈的每一天。终于，比赛的日子也即将到来……',
  },
  {
    id: 'welcome',
    image: coverWelcome,
    portrait: portraitWelcome,
    label: '剧场版 吹响吧！上低音号～欢迎来到北宇治高中吹奏乐部～',
    title: '剧场版 吹响吧！上低音号～欢迎来到北宇治高中吹奏乐部～',
    alt: '剧场版 吹响吧！上低音号～欢迎来到北宇治高中吹奏乐部～',
    kind: '剧场版',
    year: '2016',
    focusX: 8,
    synopsis:
      '以电视动画第一季为基础重新编辑的剧场版。进入北宇治高中就读的黄前久美子，在同班同学加藤叶月的热烈影响下加入了该校的吹奏部。北宇治高中吹奏部直到五年前还是关西大会的常客，但自从顾问换了之后就再也没有挺进过关西大会。以新顾问的赴任为契机，怀揣着高远目标的部员们挥洒着奋斗的青春——比赛的日子也即将到来。',
  },
  {
    id: 's2',
    image: coverS2,
    portrait: portraitS2,
    label: '吹响吧！上低音号 第二季',
    title: '吹响吧！上低音号 第二季',
    alt: '吹响吧！上低音号 第二季',
    kind: 'TV',
    year: '2016',
    focusX: 78,
    synopsis:
      '吹奏乐竞赛京都府大赛。在那里漂亮地取得金奖的北宇治高中吹奏乐部，向着下一个舞台——强豪云集的关西大赛发起挑战！',
  },
  {
    id: 'melody',
    image: coverMelody,
    portrait: portraitMelody,
    label: '剧场版 吹响吧！上低音号～想要传达的旋律～',
    title: '剧场版 吹响吧！上低音号～想要传达的旋律～',
    alt: '剧场版 吹响吧！上低音号～想要传达的旋律～',
    kind: '剧场版',
    year: '2017',
    synopsis:
      '吹奏乐竞赛全国大会出场在即，我们北宇治高中吹奏乐部。酷暑渐去、秋意渐近之时——前辈说不定要退部了……冲击太大，不安怎么也抹不去。美丽、有号召力、上低音号吹得好、被大家依赖的「特别」前辈。可她偶尔露出的冰一样冷的表情、把人推开的眼神，从不让人看见真正的自己。「想去全国」——比谁都这么想，却硬要装作成年人的前辈。这样的前辈我不太擅长……说不定曾经讨厌过。但是我——',
  },
  {
    id: 'liz',
    image: coverLiz,
    portrait: portraitLiz,
    label: '莉兹与青鸟',
    title: '莉兹与青鸟',
    alt: '莉兹与青鸟',
    kind: '剧场版',
    year: '2018',
    synopsis:
      '铠冢霙，高中三年级，双簧管演奏者。伞木希美，高中三年级，长笛演奏者。初中时，是希美牵起了霙的手，带领她走出了孤独。自那以后，希美就占据了霙的整个世界。可在高中一年级，希美一度退出了吹奏部；而她的归来，也始终未能抹去霙心中的不安——是否有一天，希美会再次消失在自己面前呢？就这样，二人迎来了高中最后的竞演会。参赛的自由曲是「莉兹与青鸟」。「故事的结局，还是越美满越好啦。」虽然希美如此认为，霙却依然对终将到来的离别心怀恐惧。',
  },
  {
    id: 'finale',
    image: coverFinale,
    portrait: portraitFinale,
    label: '剧场版 吹响吧！上低音号～誓言的终章～',
    title: '剧场版 吹响吧！上低音号～誓言的终章～',
    alt: '剧场版 吹响吧！上低音号～誓言的终章～',
    kind: '剧场版',
    year: '2019',
    synopsis:
      '北宇治高中吹奏乐部去年顺利地在全日本吹奏乐竞演会中出场。升入二年级的黄前久美子，和三年级的加部友惠一起开始负责指导从四月开始新加入的一年级生们。由于身为全国大赛的出场学校，而有很多一年级生入部。其中，有四名新生来到了低音部：乍一看似乎毫无问题的久石奏、不融入周围的铃木美玲、想要和美玲做朋友的铃木五月、不提及自身事情的月永求。Sunrise 祭、选拔赛、以及竞演赛。以「全国大赛金奖」为目标的吹奏乐部，却接连发生问题……！？北宇治高中吹奏乐部，风波不断的日子开始了！',
  },
  {
    id: 'ensemble',
    image: coverEnsemble,
    portrait: portraitEnsemble,
    label: '特别篇 吹响吧！上低音号～合奏比赛～',
    title: '特别篇 吹响吧！上低音号～合奏比赛～',
    alt: '特别篇 吹响吧！上低音号～合奏比赛～',
    kind: '特别篇',
    year: '2023',
    synopsis:
      '新世代，开启！这是由京都动画所描绘的、将梦想寄托于吹奏乐上的高中生们那微不足道却又「无比特别」的青春篇章。本次中篇动画改编自武田绫乃所著小说《吹响吧！上低音号 北宇治高中吹奏部的真实故事》中的人气章节。吹奏乐强校的吹奏部新部长所接到的第一份工作竟是部内「调整」！？北宇治吹奏部，共计 65 人。故事就在主人公——久美子作为部长，处理部员们接连不断的咨询和突然爆发的矛盾中拉开帷幕。她能顺利地完成这第一份工作吗——？调音，完成！',
  },
  {
    id: 's3',
    image: coverS3,
    portrait: portraitS3,
    label: '吹响吧！上低音号 第三季',
    title: '吹响吧！上低音号 第三季',
    alt: '吹响吧！上低音号 第三季',
    kind: 'TV',
    year: '2024',
    synopsis:
      '春天。北宇治高校吹奏乐部的三年级、部长黄前久美子，怀着期待与不安。会有什么样的新入部员到来，自己能否作为部长把大家团结起来，以及悲愿目标「全国大会金奖」能否达成——带着这些想法，久美子作为部长奔走着。与此同时，作为演奏者，她面前也出现了一堵高墙：从全国大会常胜强校转来的黑江真由，手中的乐器与久美子相同——上低音号。华丽的音色、卓越的演奏技术，以及温和的性格，让周围都仰慕她这位近乎完美的少女。然而真由偶尔流露出的阴影，却让久美子生出难以名状的感情。「反正不过是部活，没必要勉强死抓着不放……」久美子究竟会如何面对真由？寄托于吹奏乐的青春，也正走向「毕业」——「走吧，大家。」久美子，高中最后一年开始了！',
  },
  {
    id: 'final-1',
    image: coverFinalPart1,
    portrait: portraitFinalPart1,
    label: '最终乐章 吹响吧！上低音号 前篇',
    title: '最终乐章 吹响吧！上低音号 前篇',
    alt: '最终乐章 吹响吧！上低音号 前篇',
    kind: '剧场版',
    year: '2026',
    focusX: 10,
    synopsis:
      '北宇治高中三年级学生、成为管乐社社长的黄前久美子，对于会有什么样的新社员加入、身为社长是否能让大家团结一心，以及是否能实现获得「全国大赛金奖」的愿望——这些都让她内心既期待又不安，身为社长的她每天都十分忙碌。某日，来自全国大赛常胜学校的转学生黑江真由，突然出现在久美子面前，她所吹奏的乐器是和久美子一样的粗管上低音号……',
  },
  {
    id: 'final-2',
    image: coverFinalPart2,
    portrait: portraitFinalPart2,
    label: '最终乐章 吹响吧！上低音号 后篇',
    title: '最终乐章 吹响吧！上低音号 后篇',
    alt: '最终乐章 吹响吧！上低音号 后篇',
    kind: '剧场版',
    year: '2026',
    focusX: 8,
    synopsis:
      '终于系列完结！！！这段轨迹，将成为下一首曲子——历经十年描绘高中生将青春寄托于吹奏乐的《吹响吧！上低音号》系列。在 2024 年 TV 放送迎来感动最终回的《吹响吧！上低音号 3》，于 2026 年终于以完结作「最终乐章」登上银幕。《最终乐章》由率领京都动画制作团队十年的石原立也担任总监督，与小川太一共同执导；花田十辉全新撰写剧本，并追加大量新作场景，亦收录 TV 系列未能呈现的演奏场面。这里存留着，那一天的誓言——。动画《吹响吧！上低音号》堂堂迈向终幕。',
  },
]
