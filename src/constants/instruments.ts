import imageEuphonium from '@/assets/instruments/01-euphonium.png'
import imageTuba from '@/assets/instruments/02-tuba.png'
import imageContrabass from '@/assets/instruments/03-contrabass.png'
import imageTrumpet from '@/assets/instruments/04-trumpet.png'
import imageTrombone from '@/assets/instruments/05-trombone.png'
import imageHorn from '@/assets/instruments/06-horn.png'
import imageAltoSax from '@/assets/instruments/07-alto-sax.png'
import imageTenorSax from '@/assets/instruments/08-tenor-sax.png'
import imageBariSax from '@/assets/instruments/09-bari-sax.png'
import imageFlute from '@/assets/instruments/10-flute.png'
import imageClarinet from '@/assets/instruments/11-clarinet.png'
import imageOboe from '@/assets/instruments/12-oboe.png'
import imageBassoon from '@/assets/instruments/13-bassoon.png'
import imageTimpani from '@/assets/instruments/14-timpani.png'
import imageSnare from '@/assets/instruments/15-snare.png'
import imageBassDrum from '@/assets/instruments/16-bass-drum.png'
import imageGlockenspiel from '@/assets/instruments/17-glockenspiel.png'
import imageCymbals from '@/assets/instruments/18-cymbals.png'

export const INSTRUMENT_GROUPS = [
  { id: 'woodwind', name: '木管乐器', nameEn: 'WOODWIND' },
  { id: 'brass', name: '金管乐器', nameEn: 'BRASS' },
  { id: 'strings', name: '弦低音', nameEn: 'STRINGS' },
  { id: 'percussion', name: '打击乐器', nameEn: 'PERCUSSION' },
] as const

export type InstrumentGroupId = (typeof INSTRUMENT_GROUPS)[number]['id']

export type Instrument = {
  id: string
  group: InstrumentGroupId
  name: string
  nameEn: string
  intro: string
  image: string
}

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'flute',
    group: 'woodwind',
    name: '长笛',
    nameEn: 'Flute',
    intro: '木管的高音担当。金属管身却归入木管，音色清亮，合奏里常把旋律举到最高处。',
    image: imageFlute,
  },
  {
    id: 'clarinet',
    group: 'woodwind',
    name: '单簧管',
    nameEn: 'Clarinet',
    intro: '音域近四个八度的木管，柔音与跳跃皆可，人数众多的它常是中声部的地基。',
    image: imageClarinet,
  },
  {
    id: 'oboe',
    group: 'woodwind',
    name: '双簧管',
    nameEn: 'Oboe',
    intro: '靠双簧哨片吹出带鼻音的音色。乐队调音前，标准音 A 由它给出。',
    image: imageOboe,
  },
  {
    id: 'bassoon',
    group: 'woodwind',
    name: '巴松',
    nameEn: 'Bassoon',
    intro: '木管的低音，管身折成两段。低鸣时垫住和声，跳弓时又能滑稽地蹦起来。',
    image: imageBassoon,
  },
  {
    id: 'alto-sax',
    group: 'woodwind',
    name: '中音萨克斯',
    nameEn: 'Alto Sax',
    intro: '铜制管身却属木管，靠哨片发声。音色介于圆润与沙哑之间，独奏很出彩。',
    image: imageAltoSax,
  },
  {
    id: 'tenor-sax',
    group: 'woodwind',
    name: '次中音萨克斯',
    nameEn: 'Tenor Sax',
    intro: '比中音萨克斯低纯五度，音色更暖更沉，在萨克斯声部里托住中低音。',
    image: imageTenorSax,
  },
  {
    id: 'bari-sax',
    group: 'woodwind',
    name: '上低音萨克斯',
    nameEn: 'Baritone Sax',
    intro: '萨克斯家族的低音，管身绕了一整圈。声音厚重，负责低声部的律动。',
    image: imageBariSax,
  },
  {
    id: 'trumpet',
    group: 'brass',
    name: '小号',
    nameEn: 'Trumpet',
    intro: '金管的最高音，号口朝前，声音能穿透整个乐队。号角与独奏都交给它。',
    image: imageTrumpet,
  },
  {
    id: 'horn',
    group: 'brass',
    name: '圆号',
    nameEn: 'Horn',
    intro: '号口朝后的金管，把音色柔化后投向乐队，是铜管与木管之间的桥。',
    image: imageHorn,
  },
  {
    id: 'trombone',
    group: 'brass',
    name: '长号',
    nameEn: 'Trombone',
    intro: '靠滑管改变音高的金管，滑音独一无二，庄严与俏皮只差一格把位。',
    image: imageTrombone,
  },
  {
    id: 'euphonium',
    group: 'brass',
    name: '上低音号',
    nameEn: 'Euphonium',
    intro: '本作的主角乐器。音色温润厚实，在低音与小号之间唱出最柔软的中音。',
    image: imageEuphonium,
  },
  {
    id: 'tuba',
    group: 'brass',
    name: '大号',
    nameEn: 'Tuba',
    intro: '铜管家族里最大的低音，整个乐队的地基。抱住它的人，负责最沉的音。',
    image: imageTuba,
  },
  {
    id: 'contrabass',
    group: 'strings',
    name: '低音提琴',
    nameEn: 'Contrabass',
    intro: '弦乐家族的低音，弓弦与拨奏皆可，坐在低音声部最后撑住乐队的底部。',
    image: imageContrabass,
  },
  {
    id: 'timpani',
    group: 'percussion',
    name: '定音鼓',
    nameEn: 'Timpani',
    intro: '可以调音高的鼓，踏板踩出音高，一段滚奏就能推起全乐队的浪。',
    image: imageTimpani,
  },
  {
    id: 'snare',
    group: 'percussion',
    name: '小军鼓',
    nameEn: 'Snare Drum',
    intro: '鼓皮下绷着响线，敲击时沙沙作响，是节奏型与行进感的好手。',
    image: imageSnare,
  },
  {
    id: 'bass-drum',
    group: 'percussion',
    name: '大军鼓',
    nameEn: 'Bass Drum',
    intro: '立在支架上敲的大鼓，每一击都给乐队的重拍落下一记锚点。',
    image: imageBassDrum,
  },
  {
    id: 'glockenspiel',
    group: 'percussion',
    name: '钟琴',
    nameEn: 'Glockenspiel',
    intro: '金属音条按琴键排列，敲出清脆明亮的高音，像星光落在旋律上。',
    image: imageGlockenspiel,
  },
  {
    id: 'cymbals',
    group: 'percussion',
    name: '对镲',
    nameEn: 'Cymbals',
    intro: '两片黄铜相击，从轻擦到炸裂，控制着整个乐队的呼吸与高潮。',
    image: imageCymbals,
  },
]

export const DEFAULT_INSTRUMENT_ID = 'euphonium'

export function groupInstruments(groups = INSTRUMENT_GROUPS) {
  return groups.map((group) => ({
    group,
    items: INSTRUMENTS.filter((instrument) => instrument.group === group.id),
  }))
}
