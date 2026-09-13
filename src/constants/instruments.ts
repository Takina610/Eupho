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

// 试听音效取自官网乐器页(tv.anime-eupho.com/instrument)的示范演奏片段。
import soundEuphonium from '@/assets/instruments/sounds/01-euphonium.mp3'
import soundTuba from '@/assets/instruments/sounds/02-tuba.mp3'
import soundContrabass from '@/assets/instruments/sounds/03-contrabass.mp3'
import soundTrumpet from '@/assets/instruments/sounds/04-trumpet.mp3'
import soundTrombone from '@/assets/instruments/sounds/05-trombone.mp3'
import soundHorn from '@/assets/instruments/sounds/06-horn.mp3'
import soundAltoSax from '@/assets/instruments/sounds/07-alto-sax.mp3'
import soundTenorSax from '@/assets/instruments/sounds/08-tenor-sax.mp3'
import soundBariSax from '@/assets/instruments/sounds/09-bari-sax.mp3'
import soundFlute from '@/assets/instruments/sounds/10-flute.mp3'
import soundClarinet from '@/assets/instruments/sounds/11-clarinet.mp3'
import soundOboe from '@/assets/instruments/sounds/12-oboe.mp3'
import soundBassoon from '@/assets/instruments/sounds/13-bassoon.mp3'
import soundTimpani from '@/assets/instruments/sounds/14-timpani.mp3'
import soundSnare from '@/assets/instruments/sounds/15-snare.mp3'
import soundBassDrum from '@/assets/instruments/sounds/16-bass-drum.mp3'
import soundGlockenspiel from '@/assets/instruments/sounds/17-glockenspiel.mp3'
import soundCymbals from '@/assets/instruments/sounds/18-cymbals.mp3'

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
  /** 示范演奏音效,详情页「试听」按钮播放。 */
  sound: string
}

/** 以官网乐器说明为底，略带吹奏乐部语境，不点名角色。 */
export const INSTRUMENTS: Instrument[] = [
  {
    id: 'flute',
    group: 'woodwind',
    name: '长笛',
    nameEn: 'Flute',
    intro:
      '高音木管，无簧，音色清楚可人。自由曲里常与双簧管对唱——两支管并排时，旋律会显得特别近。',
    image: imageFlute,
    sound: soundFlute,
  },
  {
    id: 'clarinet',
    group: 'woodwind',
    name: '单簧管',
    nameEn: 'Clarinet',
    intro:
      '吹奏乐部里的大家族，种类繁多；B♭ 单簧管常托住中声部旋律。人一多，合奏的骨架就稳了。',
    image: imageClarinet,
    sound: soundClarinet,
  },
  {
    id: 'oboe',
    group: 'woodwind',
    name: '双簧管',
    nameEn: 'Oboe',
    intro:
      '双簧高音木管，独奏机会多，也常在调音前给出标准音 A。哨片一响，整支乐队才真正对齐。',
    image: imageOboe,
    sound: soundOboe,
  },
  {
    id: 'bassoon',
    group: 'woodwind',
    name: '巴松',
    nameEn: 'Bassoon',
    intro:
      '木管低音，与双簧管同属双簧，音色偏温。低鸣时垫住和声，偶尔蹦几下，合奏里会多一点活气。',
    image: imageBassoon,
    sound: soundBassoon,
  },
  {
    id: 'alto-sax',
    group: 'woodwind',
    name: '中音萨克斯',
    nameEn: 'Alto Sax',
    intro:
      '铜制管身却归木管，音色华丽，是萨克斯里最常见的一种。部活里独奏一出，往往最先被听见。',
    image: imageAltoSax,
    sound: soundAltoSax,
  },
  {
    id: 'tenor-sax',
    group: 'woodwind',
    name: '次中音萨克斯',
    nameEn: 'Tenor Sax',
    intro:
      '比中音萨克斯低纯五度，音色更暖。萨克斯声部里负责托住中低音，把华丽的高音接回合奏。',
    image: imageTenorSax,
    sound: soundTenorSax,
  },
  {
    id: 'bari-sax',
    group: 'woodwind',
    name: '上低音萨克斯',
    nameEn: 'Baritone Sax',
    intro:
      '萨克斯家族的低音，声音厚重。部长席上若看见这支绕圈的管子，多半是在撑着整个声部的底。',
    image: imageBariSax,
    sound: soundBariSax,
  },
  {
    id: 'trumpet',
    group: 'brass',
    name: '小号',
    nameEn: 'Trumpet',
    intro:
      '金管最高音，音色华丽，是花形的乐器。竞赛曲里的独奏常常交给它——想「特别」的人，也常从这里开始。',
    image: imageTrumpet,
    sound: soundTrumpet,
  },
  {
    id: 'horn',
    group: 'brass',
    name: '圆号',
    nameEn: 'Horn',
    intro:
      '音域很广，号口朝后，右手伸进喇叭口演奏。铜管与木管之间的桥，音色一柔，合奏就连上了。',
    image: imageHorn,
    sound: soundHorn,
  },
  {
    id: 'trombone',
    group: 'brass',
    name: '长号',
    nameEn: 'Trombone',
    intro:
      '靠滑管改音高的中低音金管，滑音独一无二。放学后还在练的人里，总有几支把在来回走。',
    image: imageTrombone,
    sound: soundTrombone,
  },
  {
    id: 'euphonium',
    group: 'brass',
    name: '上低音号',
    nameEn: 'Euphonium',
    intro:
      '中低音金管，音色柔和舒适。很少抢最亮的光，却把旋律垫在低音与小号之间——许多故事，正是从这支号开始写的。',
    image: imageEuphonium,
    sound: soundEuphonium,
  },
  {
    id: 'tuba',
    group: 'brass',
    name: '大号',
    nameEn: 'Tuba',
    intro:
      '铜管最低音，体积大而且重，是低音席的支柱。想吹花形乐器的新人，有时也会在这里重新学会合奏。',
    image: imageTuba,
    sound: soundTuba,
  },
  {
    id: 'contrabass',
    group: 'strings',
    name: '低音提琴',
    nameEn: 'Contrabass',
    intro:
      '吹奏乐部里唯一的弦乐器，低沉沉稳，总之就是很大。弓一拉，整支乐队的底部才真正落稳。',
    image: imageContrabass,
    sound: soundContrabass,
  },
  {
    id: 'timpani',
    group: 'percussion',
    name: '定音鼓',
    nameEn: 'Timpani',
    intro:
      '可调音高的鼓。一段滚奏推起来，竞赛场上的浪往往从这里开始。',
    image: imageTimpani,
    sound: soundTimpani,
  },
  {
    id: 'snare',
    group: 'percussion',
    name: '小军鼓',
    nameEn: 'Snare Drum',
    intro:
      '鼓下绷着响弦，敲击时沙沙作响。行进感与节奏型的好手，合奏一紧，它往往最先咬住拍点。',
    image: imageSnare,
    sound: soundSnare,
  },
  {
    id: 'bass-drum',
    group: 'percussion',
    name: '大军鼓',
    nameEn: 'Bass Drum',
    intro:
      '低沉有力的大鼓。每一击给重拍落下锚点——谱面上的「强」，常常先从这里听见。',
    image: imageBassDrum,
    sound: soundBassDrum,
  },
  {
    id: 'glockenspiel',
    group: 'percussion',
    name: '钟琴',
    nameEn: 'Glockenspiel',
    intro:
      '金属音板按音高排列，音色清脆。自由曲的高音里若闪过一点星光，多半是它在敲。',
    image: imageGlockenspiel,
    sound: soundGlockenspiel,
  },
  {
    id: 'cymbals',
    group: 'percussion',
    name: '对镲',
    nameEn: 'Cymbals',
    intro:
      '一对铜钹，从轻擦到炸裂。高潮到来时，整支乐队的呼吸往往就卡在这一击上。',
    image: imageCymbals,
    sound: soundCymbals,
  },
]

export const DEFAULT_INSTRUMENT_ID = 'euphonium'

export function groupInstruments(groups = INSTRUMENT_GROUPS) {
  return groups.map((group) => ({
    group,
    items: INSTRUMENTS.filter((instrument) => instrument.group === group.id),
  }))
}
