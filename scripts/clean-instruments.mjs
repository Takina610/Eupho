import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const dir = fileURLToPath(new URL('../src/assets/instruments/', import.meta.url))
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort()

/** Near-white enclosed regions at or above this size are matte leftovers, not highlights. */
const WHITE_COMPONENT_MIN_SIZE = {
  '01-euphonium.png': 40,
  '02-tuba.png': 40,
  '04-trumpet.png': 300,
  '05-trombone.png': 40,
  '06-horn.png': 40,
  '07-alto-sax.png': 40,
  '08-tenor-sax.png': 40,
  '09-bari-sax.png': 40,
  '14-timpani.png': 40,
  '15-snare.png': 40,
  '16-bass-drum.png': 40,
  '17-glockenspiel.png': 300,
}
const DESPECKLE_MIN_SIZE = 16
/** Matte white is slightly off-white here: low saturation and a high minimum channel. */
const WHITE_MIN_CHANNEL = 195
const WHITE_MAX_SPREAD = 48

const isWhiteish = (r, g, b) => {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return min >= WHITE_MIN_CHANNEL && max - min <= WHITE_MAX_SPREAD
}

function components(mask, width, height) {
  // 4-connected labeling over truthy mask cells; returns array of { pixels: number[] }
  const seen = new Uint8Array(width * height)
  const comps = []
  const stack = []
  for (let start = 0; start < width * height; start += 1) {
    if (!mask[start] || seen[start]) continue
    const comp = []
    stack.push(start)
    seen[start] = 1
    while (stack.length) {
      const p = stack.pop()
      comp.push(p)
      const x = p % width
      const y = (p / width) | 0
      if (x > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1) }
      if (x < width - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1) }
      if (y > 0 && mask[p - width] && !seen[p - width]) { seen[p - width] = 1; stack.push(p - width) }
      if (y < height - 1 && mask[p + width] && !seen[p + width]) { seen[p + width] = 1; stack.push(p + width) }
    }
    comps.push(comp)
  }
  return comps
}

for (const file of files) {
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, file)))
  const { width: w, height: h, data } = png
  const n = w * h
  const opaque = new Uint8Array(n)
  const nearWhite = new Uint8Array(n)
  for (let p = 0; p < n; p += 1) {
    const i = p * 4
    if (data[i + 3] > 128) {
      opaque[p] = 1
      if (isWhiteish(data[i], data[i + 1], data[i + 2])) {
        nearWhite[p] = 1
      }
    }
  }

  let removedWhite = 0
  // 1) matte-white enclosed regions in configured images, and any border-touching white elsewhere
  const whiteComps = components(nearWhite, w, h)
  const minSize = WHITE_COMPONENT_MIN_SIZE[file]
  for (const comp of whiteComps) {
    const touchesBorder = comp.some((p) => {
      const x = p % w
      const y = (p / w) | 0
      return x === 0 || y === 0 || x === w - 1 || y === h - 1
    })
    const bogus = (minSize != null && comp.length >= minSize) || (touchesBorder && comp.length >= 6)
    if (bogus) {
      for (const p of comp) {
        const i = p * 4
        data[i + 3] = 0
        removedWhite += 1
        opaque[p] = 0
        nearWhite[p] = 0
      }
      // also clear the semi-transparent near-white fringe around the removed region
      for (const p of comp) {
        const x = p % w
        const y = (p / w) | 0
        for (const q of [
          y > 0 ? p - w : -1, y < h - 1 ? p + w : -1,
          x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1,
        ]) {
          if (q < 0) continue
          const qi = q * 4
          if (data[qi + 3] > 0 && isWhiteish(data[qi], data[qi + 1], data[qi + 2])) {
            data[qi + 3] = 0
            opaque[q] = 0
          }
        }
      }
    }
  }

  // 2) despeckle: drop tiny isolated opaque islands
  let specks = 0
  for (const comp of components(opaque, w, h)) {
    if (comp.length < DESPECKLE_MIN_SIZE) {
      for (const p of comp) {
        data[p * 4 + 3] = 0
        opaque[p] = 0
        specks += 1
      }
    }
  }

  // 3) feather: soften hard 1px alpha boundaries
  let feathered = 0
  const alphaBefore = new Uint8Array(n)
  for (let p = 0; p < n; p += 1) alphaBefore[p] = data[p * 4 + 3]
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const p = y * w + x
      const a = alphaBefore[p]
      const hard = a >= 250
      const empty = a <= 5
      if (hard === empty) continue
      let hardNeighbor = false
      let solidNeighbor = false
      if (x > 0) { const b = alphaBefore[p - 1]; hardNeighbor ||= b <= 5; solidNeighbor ||= b >= 250 }
      if (x < w - 1) { const b = alphaBefore[p + 1]; hardNeighbor ||= b <= 5; solidNeighbor ||= b >= 250 }
      if (y > 0) { const b = alphaBefore[p - w]; hardNeighbor ||= b <= 5; solidNeighbor ||= b >= 250 }
      if (y < h - 1) { const b = alphaBefore[p + w]; hardNeighbor ||= b <= 5; solidNeighbor ||= b >= 250 }
      const i = p * 4
      if (hard && hardNeighbor) {
        data[i + 3] = 190
        feathered += 1
      } else if (empty && solidNeighbor) {
        // grow a faint 1px fringe using the neighbouring pixel's colour
        for (const q of [
          x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1,
          y > 0 ? p - w : -1, y < h - 1 ? p + w : -1,
        ]) {
          if (q >= 0 && alphaBefore[q] >= 250) {
            const qi = q * 4
            data[i] = data[qi]
            data[i + 1] = data[qi + 1]
            data[i + 2] = data[qi + 2]
            break
          }
        }
        data[i + 3] = 90
        feathered += 1
      }
    }
  }

  fs.writeFileSync(path.join(dir, file), PNG.sync.write(png))
  console.log(`${file}  removedWhite=${removedWhite}  specks=${specks}  feathered=${feathered}`)
}
