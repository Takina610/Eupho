import imageKumiko from '@/assets/characters/01-kumiko.webp'
import imageHazuki from '@/assets/characters/02-hazuki.webp'
import imageSapphire from '@/assets/characters/03-sapphire.webp'
import imageReina from '@/assets/characters/04-reina.webp'
import imageMayu from '@/assets/characters/05-mayu.webp'
import imageSyuichi from '@/assets/characters/06-syuichi.webp'
import imageTsubame from '@/assets/characters/07-tsubame.webp'
import imageKanade from '@/assets/characters/08-kanade.webp'
import imageMirei from '@/assets/characters/09-mirei.webp'
import imageSatsuki from '@/assets/characters/10-satsuki.webp'
import imageMotomu from '@/assets/characters/11-motomu.webp'
import imageRirika from '@/assets/characters/12-ririka.webp'
import imageSuzume from '@/assets/characters/13-suzume.webp'
import imageYayoi from '@/assets/characters/14-yayoi.webp'
import imageKaho from '@/assets/characters/15-kaho.webp'
import imageSari from '@/assets/characters/16-sari.webp'
import imageAsuka from '@/assets/characters/17-asuka.webp'
import imageHaruka from '@/assets/characters/18-haruka.webp'
import imageKaori from '@/assets/characters/19-kaori.webp'
import imageNatsuki from '@/assets/characters/20-natsuki.webp'
import imageYuko from '@/assets/characters/21-yuko.webp'
import imageMizore from '@/assets/characters/22-mizore.webp'
import imageNozomi from '@/assets/characters/23-nozomi.webp'
import backdropHazuki from '@/assets/characters/backend/hazuki.png'
import backdropKanade from '@/assets/characters/backend/kanade.png'
import backdropKumiko from '@/assets/characters/backend/kumiko.png'
import backdropMirei from '@/assets/characters/backend/mirei.png'
import backdropMotomu from '@/assets/characters/backend/motomu.png'
import backdropNatsuki from '@/assets/characters/backend/natsuki.png'
import backdropReina from '@/assets/characters/backend/reina.png'
import backdropSapphire from '@/assets/characters/backend/sapphire.png'
import backdropSatsuki from '@/assets/characters/backend/satsuki.png'
import backdropSyuichi from '@/assets/characters/backend/syuichi.png'
import backdropYuko from '@/assets/characters/backend/yuko.png'

export type Character = {
  id: string
  image: string
  backdrop: string
  name: string
  nameEn: string
  part: string
  grade: string
  cv: string
  synopsis: string
  /** roster card: face point in the standing art (x%, y%) and figure width / well width */
  focus: readonly [number, number, number]
  /**
   * 后景裁切：[x%, y%, 放大]。每人单独改这一行。
   * x 越大画面越靠右，y 越大越靠下；1 为当前大小，大于 1 放大。
   */
  back: readonly [number, number, number]
}

const BACK_UNIQUE = [38, 10, 1] as const
const BACK_FALLBACK = [42, 8, 1] as const

function member(
  entry: Omit<Character, 'backdrop' | 'back'> & {
    backdrop?: string
    back?: Character['back']
  },
): Character {
  const next = { backdrop: entry.image, ...entry }
  const unique = next.backdrop !== next.image
  return {
    ...next,
    back: entry.back ?? (unique ? BACK_UNIQUE : BACK_FALLBACK),
  }
}

export const CHARACTERS: Character[] = [
  member({
    id: 'kumiko',
    focus: [33, 10, 2.10],
    back: [38, 10, 1],
    image: imageKumiko,
    backdrop: backdropKumiko,
    name: '黄前久美子',
    nameEn: 'Oumae Kumiko',
    part: '上低音号',
    grade: '三年生',
    cv: '黑泽朋世',
    synopsis: '把「这次要认真」说出口的人。从一年生走到部长席，金管的光最后还是对准她手里的上低音号。',
  }),
  member({
    id: 'hazuki',
    focus: [70, 13, 2.32],
    back: [38, 10, 1],
    image: imageHazuki,
    backdrop: backdropHazuki,
    name: '加藤叶月',
    nameEn: 'Katou Hazuki',
    part: '大号',
    grade: '三年生',
    cv: '朝井彩加',
    synopsis: '网球部出身的气氛制造者。低音号从零开始，笑意却一直给北宇治垫底。',
  }),
  member({
    id: 'sapphire',
    focus: [30, 24, 2.38],
    back: [38, 10, 1],
    image: imageSapphire,
    backdrop: backdropSapphire,
    name: '川岛绿辉',
    nameEn: 'Kawashima Sapphire',
    part: '低音提琴',
    grade: '三年生',
    cv: '丰田萌绘',
    synopsis: '请叫她 Sapphire。圣女出身的低音提琴，练习可以练到指尖见红，把低音当作自己的位置。',
  }),
  member({
    id: 'reina',
    focus: [44, 12, 2.32],
    back: [38, 10, 1],
    image: imageReina,
    backdrop: backdropReina,
    name: '高坂丽奈',
    nameEn: 'Kousaka Reina',
    part: '小号',
    grade: '三年生',
    cv: '安济知佳',
    synopsis: '为了成为与众不同的人而吹小号。要求严格，人际疏离，独奏的光总是先落在她身上。',
  }),
  member({
    id: 'mayu',
    focus: [52, 13, 2.25],
    back: [42, 8, 1],
    image: imageMayu,
    name: '黑江真由',
    nameEn: 'Kuroe Mayu',
    part: '上低音号',
    grade: '三年生',
    cv: '户松遥',
    synopsis: '从清良转来的三年生。同声部的另一支上低音号，把独奏权重新放到选拔台上。',
  }),
  member({
    id: 'syuichi',
    focus: [68, 9, 2.22],
    back: [38, 10, 1],
    image: imageSyuichi,
    backdrop: backdropSyuichi,
    name: '冢本秀一',
    nameEn: 'Tsukamoto Shuichi',
    part: '长号',
    grade: '三年生',
    cv: '石谷春贵',
    synopsis: '久美子的青梅竹马，长号声部的同级。告白、暂停、再开口，曲子比关系更容易对齐。',
  }),
  member({
    id: 'tsubame',
    focus: [58, 13, 2.80],
    back: [42, 8, 1],
    image: imageTsubame,
    name: '釜屋燕',
    nameEn: 'Kamaya Tsubame',
    part: '打击乐',
    grade: '二年生',
    cv: '大桥彩香',
    synopsis: '马林巴那边的二年生。合奏比赛那年走进久美子的小组，把节奏垫进低音的缝里。',
  }),
  member({
    id: 'kanade',
    focus: [71, 13, 2.00],
    back: [38, 10, 1],
    image: imageKanade,
    backdrop: backdropKanade,
    name: '久石奏',
    nameEn: 'Hisaishi Kanade',
    part: '上低音号',
    grade: '二年生',
    cv: '雨宫天',
    synopsis: '彬彬有礼，笑意后面有一点小恶魔。上低音号的后辈，把「认真」问得更尖。',
  }),
  member({
    id: 'mirei',
    focus: [50, 11, 2.90],
    back: [38, 10, 1],
    image: imageMirei,
    backdrop: backdropMirei,
    name: '铃木美玲',
    nameEn: 'Suzuki Mirei',
    part: '大号',
    grade: '二年生',
    cv: '七濑彩夏',
    synopsis: '部里最高的那一个。南宇治出身，吹得很好，却不容易走进大家的气氛。',
  }),
  member({
    id: 'satsuki',
    focus: [50, 18, 2.22],
    back: [38, 10, 1],
    image: imageSatsuki,
    backdrop: backdropSatsuki,
    name: '铃木五月',
    nameEn: 'Suzuki Satsuki',
    part: '大号',
    grade: '二年生',
    cv: '久野美咲',
    synopsis: '和美玲同姓、同小学，没有亲戚关系。性格软，大号还在追谱，却愿意一直吹。',
  }),
  member({
    id: 'motomu',
    focus: [38, 22, 2.28],
    back: [38, 10, 1],
    image: imageMotomu,
    backdrop: backdropMotomu,
    name: '月永求',
    nameEn: 'Tsukinaga Motomu',
    part: '低音提琴',
    grade: '二年生',
    cv: '土屋神叶',
    synopsis: '不喜欢被叫姓。祖父是吹奏乐指导者，他偏要来北宇治，和绿辉把低音提琴并成一对。',
  }),
  member({
    id: 'ririka',
    focus: [33, 13, 2.35],
    back: [42, 8, 1],
    image: imageRirika,
    name: '剑崎梨梨花',
    nameEn: 'Kenzaki Ririka',
    part: '双簧管',
    grade: '二年生',
    cv: '杉浦栞',
    synopsis: '看起来像辣妹，语气却软。作为霙的后辈，把双簧管的位置重新接上。',
  }),
  member({
    id: 'suzume',
    focus: [62, 32, 2.48],
    back: [42, 8, 1],
    image: imageSuzume,
    name: '釜屋雀',
    nameEn: 'Kamaya Suzume',
    part: '大号',
    grade: '一年生',
    cv: '夏川椎菜',
    synopsis: '燕的妹妹。一年生的大号，跟着姐姐走进北宇治的低音席。',
  }),
  member({
    id: 'yayoi',
    focus: [28, 12, 2.52],
    back: [42, 8, 1],
    image: imageYayoi,
    name: '上石弥生',
    nameEn: 'Ageishi Yayoi',
    part: '大号',
    grade: '一年生',
    cv: '松田彩音',
    synopsis: '一年生低音声部。大号还新，位置已经排进最终乐章的谱面。',
  }),
  member({
    id: 'kaho',
    focus: [66, 12, 2.50],
    back: [42, 8, 1],
    image: imageKaho,
    name: '针谷佳穗',
    nameEn: 'Hariya Kaho',
    part: '上低音号',
    grade: '一年生',
    cv: '寺泽百花',
    synopsis: '上低音号的一年生。前辈们把「认真」说过一轮，她从另一头再吹一次。',
  }),
  member({
    id: 'sari',
    focus: [59, 13, 2.60],
    back: [42, 8, 1],
    image: imageSari,
    name: '义井沙里',
    nameEn: 'Yoshii Sari',
    part: '单簧管',
    grade: '一年生',
    cv: '陶山惠实里',
    synopsis: '木管席上的一年生。单簧管把新一年的声音接进合奏。',
  }),
  member({
    id: 'asuka',
    focus: [68, 12, 2.38],
    back: [42, 8, 1],
    image: imageAsuka,
    name: '田中明日香',
    nameEn: 'Tanaka Asuka',
    part: '上低音号',
    grade: '毕业生',
    cv: '寿美菜子',
    synopsis: '红框眼镜的前副部长。低音声部的轴，中立得像不说话，其实一直在把乐团托住。',
  }),
  member({
    id: 'haruka',
    focus: [56, 12, 2.50],
    back: [42, 8, 1],
    image: imageHaruka,
    name: '小笠原晴香',
    nameEn: 'Ogasawara Haruka',
    part: '圆号',
    grade: '毕业生',
    cv: '早见沙织',
    synopsis: '那一年的部长。圆号温，性格也软，把北宇治从「差不多就好」往全国那边推了一把。',
  }),
  member({
    id: 'kaori',
    focus: [44, 12, 2.40],
    back: [42, 8, 1],
    image: imageKaori,
    name: '中世古香织',
    nameEn: 'Nakaseko Kaori',
    part: '小号',
    grade: '毕业生',
    cv: '茅原实里',
    synopsis: '小号声部的领队，被称作部里的玛丹娜。独奏的位置她让过一次，光仍留在她身上。',
  }),
  member({
    id: 'natsuki',
    focus: [50, 12, 1.90],
    back: [38, 10, 1],
    image: imageNatsuki,
    backdrop: backdropNatsuki,
    name: '中川夏纪',
    nameEn: 'Nakagawa Natsuki',
    part: '上低音号',
    grade: '毕业生',
    cv: '藤村鼓乃美',
    synopsis: '高中才摸上低音号。为了把希美请回来，认真是后来才学会的那一门。',
  }),
  member({
    id: 'yuko',
    focus: [55, 12, 2.50],
    back: [38, 10, 1],
    image: imageYuko,
    backdrop: backdropYuko,
    name: '吉川优子',
    nameEn: 'Yoshikawa Yuko',
    part: '小号',
    grade: '毕业生',
    cv: '山冈百合',
    synopsis: '仰慕香织的小号。嫉妒、施压、再学会站到部长席，性子比号嘴硬。',
  }),
  member({
    id: 'mizore',
    focus: [57, 11, 2.40],
    back: [42, 8, 1],
    image: imageMizore,
    name: '铠冢霙',
    nameEn: 'Yoroizuka Mizore',
    part: '双簧管',
    grade: '毕业生',
    cv: '种崎敦美',
    synopsis: '把双簧管当作和希美唯一的联系。利兹与青鸟从她这边望出去，依赖和毕业叠在同一根簧片上。',
  }),
  member({
    id: 'nozomi',
    focus: [50, 11, 2.18],
    back: [42, 8, 1],
    image: imageNozomi,
    name: '伞木希美',
    nameEn: 'Kasaki Nozomi',
    part: '长笛',
    grade: '毕业生',
    cv: '东山奈央',
    synopsis: '退部过一次的长笛。想改革北宇治，也想回到明日香身边，和霙的距离比音程难调。',
  }),
]
