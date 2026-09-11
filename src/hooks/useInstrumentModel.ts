import { useCallback, useRef, useState } from 'react'

/**
 * A particle shape sampled from a source image: normalized coordinates centered on the
 * artwork's opaque bounding box, y pointing up, height mapped to 1. `spanX` is the
 * horizontal extent of that box (for fitting long instruments into narrow viewports).
 * Layout: [x, y, alpha] per point.
 */
export type ShapeModel = {
  points: Float32Array
  aspect: number
  spanX: number
}

const MAX_POINTS = 7000
const ALPHA_THRESHOLD = 100
const SAMPLE_STEP = 1

function shuffleTriplets(points: Float32Array, tripletCount: number) {
  for (let i = tripletCount - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    for (let k = 0; k < 3; k += 1) {
      const a = i * 3 + k
      const b = j * 3 + k
      const tmp = points[a]
      points[a] = points[b]
      points[b] = tmp
    }
  }
}

async function sampleImage(src: string): Promise<ShapeModel> {
  const image = new Image()
  image.src = src
  await image.decode()

  const { width, height } = image
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error(`cannot sample ${src}: no 2d context`)
  context.drawImage(image, 0, 0)
  const { data } = context.getImageData(0, 0, width, height)

  const collected: number[] = []
  let minNX = Infinity
  let maxNX = -Infinity
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha < ALPHA_THRESHOLD) continue
      // height-normalized, y up
      const nx = (x + SAMPLE_STEP / 2 - width / 2) / height
      if (nx < minNX) minNX = nx
      if (nx > maxNX) maxNX = nx
      collected.push(nx)
      collected.push((height / 2 - y - SAMPLE_STEP / 2) / height)
      collected.push(alpha / 255)
    }
  }
  if (!Number.isFinite(minNX)) {
    return { points: new Float32Array(0), aspect: width / height, spanX: 0 }
  }

  const all = Float32Array.from(collected)
  const spanX = maxNX - minNX
  // recenter on the opaque bounding box so long instruments stay centered when scaled
  const centerX = (minNX + maxNX) / 2
  for (let i = 0; i < all.length; i += 3) all[i] -= centerX

  const tripletCount = Math.floor(all.length / 3)
  if (tripletCount === 0) {
    return { points: new Float32Array(0), aspect: width / height, spanX }
  }

  if (tripletCount > MAX_POINTS) {
    const keep = new Float32Array(MAX_POINTS * 3)
    const stride = tripletCount / MAX_POINTS
    for (let i = 0; i < MAX_POINTS; i += 1) {
      const src = Math.floor(i * stride) * 3
      keep[i * 3] = all[src]
      keep[i * 3 + 1] = all[src + 1]
      keep[i * 3 + 2] = all[src + 2]
    }
    shuffleTriplets(keep, MAX_POINTS)
    return { points: keep, aspect: width / height, spanX }
  }

  shuffleTriplets(all, tripletCount)
  return { points: all.subarray(0, tripletCount * 3), aspect: width / height, spanX }
}

/**
 * Lazily rasterize instrument artwork into particle point clouds; results are cached
 * for the lifetime of the section.
 */
export function useInstrumentModels() {
  const [models, setModels] = useState<Record<string, ShapeModel>>({})
  const pending = useRef(new Set<string>())

  const loadModel = useCallback(
    (id: string, src: string) => {
      if (pending.current.has(id)) return
      pending.current.add(id)
      sampleImage(src)
        .then((model) => setModels((prev) => ({ ...prev, [id]: model })))
        .catch(() => pending.current.delete(id))
    },
    [],
  )

  return { models, loadModel }
}
