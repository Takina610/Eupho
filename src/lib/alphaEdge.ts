export type VisualSpan = {
  /** Leftmost visually-significant column, as a fraction (0-1) of image width. */
  left: number
  /** Rightmost visually-significant column, as a fraction (0-1) of image width. */
  right: number
}

const SPAN_CACHE = new Map<string, Promise<VisualSpan | null>>()

const SCAN_WIDTH = 256
const ALPHA_MIN = 32
/** A column counts as "figure" only if at least this many scanned rows are opaque. */
const OPAQUE_ROWS_MIN = 1
const OPAQUE_ROWS_RATIO = 0.004

/**
 * Find where the visible silhouette of a transparent PNG actually starts and
 * ends horizontally, so effects can react to the character's edge instead of
 * the image box (which is usually square with transparent padding). Results
 * are cached per image source; `img` must be loaded (`complete`).
 */
export function imageVisualSpan(img: HTMLImageElement): Promise<VisualSpan | null> {
  const src = img.currentSrc || img.src
  if (!src || img.naturalWidth === 0) {
    return Promise.resolve(null)
  }
  let span = SPAN_CACHE.get(src)
  if (!span) {
    span = scanImage(img)
    SPAN_CACHE.set(src, span)
  }
  return span
}

async function scanImage(img: HTMLImageElement): Promise<VisualSpan | null> {
  const width = SCAN_WIDTH
  const height = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * width))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return null
  }
  ctx.drawImage(img, 0, 0, width, height)
  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, width, height).data
  } catch {
    return null // tainted canvas (cross-origin without CORS): no edge info
  }

  const rowMin = Math.max(OPAQUE_ROWS_MIN, Math.round(height * OPAQUE_ROWS_RATIO))
  const columnHasFigure = (x: number) => {
    let opaqueRows = 0
    for (let y = 0; y < height; y += 1) {
      if (data[(y * width + x) * 4 + 3] >= ALPHA_MIN) {
        opaqueRows += 1
        if (opaqueRows >= rowMin) {
          return true
        }
      }
    }
    return false
  }

  let left = -1
  let right = -1
  for (let x = 0; x < width && left < 0; x += 1) {
    if (columnHasFigure(x)) {
      left = x
    }
  }
  for (let x = width - 1; x >= 0 && right < 0; x -= 1) {
    if (columnHasFigure(x)) {
      right = x
    }
  }
  if (left < 0 || right < 0) {
    return null
  }
  return { left: left / width, right: (right + 1) / width }
}
