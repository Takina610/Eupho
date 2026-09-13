export type PreloadSnapshot = {
  /** 已加载（含加载失败）的资源数 */
  loaded: number
  total: number
  /** 全部请求都已落定（成功或失败） */
  settled: boolean
}

/** 并发上限：再高也受浏览器同源连接数限制，池子小一点进度条更平滑。 */
const CONCURRENCY = 8

const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|flac)$/i

function loadResource(url: string): Promise<void> {
  // 音频走 fetch 预热 HTTP 缓存（构建产物带内容哈希，命中强缓存）；
  // 图片用 Image 解码，后续 <img>/CSS 引用直接命中缓存。
  if (AUDIO_EXT.test(url)) {
    return fetch(url).then(
      () => undefined,
      () => undefined,
    )
  }
  return new Promise((resolve) => {
    const image = new Image()
    // 失败也算完成：个别资源缺失时不能把开屏卡死
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = url
  })
}

/** 可订阅进度的预载任务；快照为不可变对象，适配 useSyncExternalStore。 */
export class ResourcePreloadTask {
  readonly promise: Promise<void>

  private listeners = new Set<() => void>()
  private state: PreloadSnapshot

  constructor(urls: readonly string[]) {
    const unique = Array.from(new Set(urls))
    this.state = { loaded: 0, total: unique.length, settled: unique.length === 0 }
    this.promise = this.run(unique)
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = (): PreloadSnapshot => this.state

  private async run(urls: string[]) {
    const queue = [...urls]
    const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, () =>
      this.drain(queue),
    )
    await Promise.all(workers)
    this.patch({ settled: true })
  }

  private async drain(queue: string[]) {
    while (queue.length > 0) {
      const url = queue.shift() as string
      await loadResource(url)
      this.patch({ loaded: this.state.loaded + 1 })
    }
  }

  private patch(partial: Partial<PreloadSnapshot>) {
    this.state = { ...this.state, ...partial }
    for (const listener of this.listeners) listener()
  }
}

let bootTask: ResourcePreloadTask | null = null

/** 整站只跑一次的开屏预载（StrictMode 双挂载时复用同一份进度）。 */
export function getBootPreloadTask(urls: readonly string[]): ResourcePreloadTask {
  bootTask ??= new ResourcePreloadTask(urls)
  return bootTask
}
