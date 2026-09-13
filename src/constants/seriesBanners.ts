import bannerSaisyugakusyo from '@/assets/banners/officialSite-saisyugakusyo.webp'
import bannerEnsemble from '@/assets/banners/officialSite-ensemble.jpg'
import bannerMovie from '@/assets/banners/officialSiteMovie.jpg'
import bannerMovie2nd from '@/assets/banners/officialSiteMovie2nd.jpg'
import bannerMovie3rd from '@/assets/banners/officialSiteMovie3rd.jpg'
import bannerLiz from '@/assets/banners/officialSiteLiz.jpg'
import banner1st from '@/assets/banners/officialSite1st.jpg'
import banner2nd from '@/assets/banners/officialSite2nd.jpg'
import banner3rd from '@/assets/banners/officialSite3rd.jpg'

export type SeriesBanner = {
  src: string
  href: string
  alt: string
}

/**
 * 官网 footer 的 series-banner：各系列官方站点横幅，新作出上、旧作居下。
 * 图源为 anime-eupho.com 的 240×60 banner。
 */
export const SERIES_BANNERS: SeriesBanner[] = [
  { src: bannerSaisyugakusyo, href: 'https://anime-eupho.com/', alt: '《吹响吧！上低音号》系列官方网站' },
  { src: banner3rd, href: 'https://tv3rd.anime-eupho.com/', alt: 'TV动画《吹响吧！上低音号》第三季官方网站' },
  { src: bannerEnsemble, href: 'https://ensemble.anime-eupho.com/', alt: '特别篇《合奏比赛》官方网站' },
  { src: bannerMovie3rd, href: 'https://movie3.anime-eupho.com/', alt: '剧场版《誓言的终章》官方网站' },
  { src: bannerLiz, href: 'https://liz-bluebird.com/', alt: '剧场版《莉兹与青鸟》官方网站' },
  { src: bannerMovie2nd, href: 'https://movie2.anime-eupho.com/', alt: '剧场版《想要传达的旋律》官方网站' },
  { src: banner2nd, href: 'https://tv2nd.anime-eupho.com/', alt: 'TV动画《吹响吧！上低音号》第二季官方网站' },
  { src: bannerMovie, href: 'https://movie.anime-eupho.com/', alt: '剧场版《欢迎来到北宇治高中吹奏乐部》官方网站' },
  { src: banner1st, href: 'https://tv.anime-eupho.com/', alt: 'TV动画《吹响吧！上低音号》第一季官方网站' },
]
