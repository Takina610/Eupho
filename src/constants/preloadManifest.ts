import castStaffBg from '@/assets/backgrounds/cast-staff.webp'
import introArt from '@/assets/introduction/intro-img.webp'
import introArtSp from '@/assets/introduction/intro-img-sp.webp'
import sceneStrip from '@/assets/introduction/scene-strip.webp'
import { CHARACTERS } from './characters'
import { INSTRUMENTS } from './instruments'
import { SERIES_BANNERS } from './seriesBanners'
import { SERIES_WORKS } from './seriesCovers'

/**
 * 全站开屏预载清单：各页面会展示到的图片都在这里汇合。
 * 新增页面图片时把数据挂进对应 constants 文件即可，无需另记一份路径。
 */
export const PRELOAD_IMAGES: readonly string[] = Array.from(
  new Set([
    ...SERIES_WORKS.flatMap((work) => [work.image, work.portrait]),
    ...CHARACTERS.flatMap((character) => [character.image, character.backdrop]),
    ...SERIES_BANNERS.map((banner) => banner.src),
    ...INSTRUMENTS.map((instrument) => instrument.image),
    castStaffBg,
    introArt,
    introArtSp,
    sceneStrip,
  ]),
)
