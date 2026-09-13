import castStaffBg from '@/assets/backgrounds/cast-staff.webp'
import introArt from '@/assets/introduction/intro-img.webp'
import introArtSp from '@/assets/introduction/intro-img-sp.webp'
import menuKeyvisual from '@/assets/keyvisual.jpg'
import footerIntroCopy from '@/assets/top-intro-copy-last.webp'
import menuIcon from '@/assets/eupho.webp'
import { CHARACTERS } from './characters'
import { INSTRUMENTS } from './instruments'
import { SERIES_BANNERS } from './seriesBanners'
import { SERIES_WORKS } from './seriesCovers'
import { STAFF_NOTE_ASSETS } from './seriesStaff'

/**
 * 全站开屏预载清单：各页面会展示/播到的资源都在这里汇合。
 * 数据驱动的资源（封面/立绘/乐器图与音效/横幅）随对应 constants 自动汇入；
 * CSS url() 或散落的图（keyvisual、footer 宣传语、菜单图标）在这里单独列出。
 */
export const PRELOAD_RESOURCES: readonly string[] = Array.from(
  new Set([
    ...SERIES_WORKS.flatMap((work) => [work.image, work.portrait]),
    ...CHARACTERS.flatMap((character) => [character.image, character.backdrop]),
    ...SERIES_BANNERS.map((banner) => banner.src),
    ...INSTRUMENTS.flatMap((instrument) => [instrument.image, instrument.sound]),
    castStaffBg,
    introArt,
    introArtSp,
    menuKeyvisual,
    footerIntroCopy,
    menuIcon,
    ...STAFF_NOTE_ASSETS,
  ]),
)
