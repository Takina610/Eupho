export type PreloadSnapshot = {
  /** 已加载（含加载失败）的图片数 */
  loaded: number
  total: number
  /** 全部请求都已落定（成功或失败） */
  settled: boolean
}

/** 并发上限：再高也受浏览器同源连接数限制，池子小一点进度条更平滑。 */
const CONCURRENCY = 8

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image()
    // 失败也算完成：个别资源缺失时不能把开屏卡死
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = url
  })
}

/** 可订阅进度的预载任务；快照为不可变对象，适配 useSyncExternalStore。 */
export class ImagePreloadTask {
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
      await loadImage(url)
      this.patch({ loaded: this.state.loaded + 1 })
    }
  }

  private patch(partial: Partial<PreloadSnapshot>) {
    this.state = { ...this.state, ...partial }
    for (const listener of this.listeners) listener()
  }
}

let bootTask: ImagePreloadTask | null = null

/** 整站只跑一次的开屏预载（StrictMode 双挂载时复用同一份进度）。 */
export function getBootPreloadTask(urls: readonly string[]): ImagePreloadTask {
  bootTask ??= new ImagePreloadTask(urls)
  return bootTask
}
