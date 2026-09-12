import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const dir = fileURLToPath(new URL('../src/assets/instruments/', import.meta.url))
const TARGETS = [
  '01-euphonium.png',
  '02-tuba.png',
  '05-trombone.png',
  '06-horn.png',
  '07-alto-sax.png',
  '08-tenor-sax.png',
  '09-bari-sax.png',
  '14-timpani.png',
  '15-snare.png',
  '16-bass-drum.png',
]
const LUM = 195
const MAX_SAT = 48
const MIN_SIZE = 40

const isWhiteish = (r, g, b) => {
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  return mn >= LUM && mx - mn <= MAX_SAT
}

function components(mask, width, height) {
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
      for (const q of [
        x > 0 ? p - 1 : -1, x < width - 1 ? p + 1 : -1,
        y > 0 ? p - width : -1, y < height - 1 ? p + width : -1,
      ]) {
        if (q >= 0 && mask[q] && !seen[q]) { seen[q] = 1; stack.push(q) }
      }
    }
    comps.push(comp)
  }
  return comps
}

// overlay sheet: magenta bg, artwork dim, would-be-removed pixels in green
const CELL_W = 660
const CELL_H = 500
const COLS = 2
const rows = Math.ceil(TARGETS.length / COLS)
const sheet = new PNG({ width: CELL_W * COLS, height: CELL_H * rows })
for (let i = 0; i < sheet.data.length; i += 4) {
  sheet.data[i] = 60; sheet.data[i + 1] = 12; sheet.data[i + 2] = 46; sheet.data[i + 3] = 255
}

TARGETS.forEach((file, index) => {
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, file)))
  const { width: w, height: h, data } = png
  const mask = new Uint8Array(w * h)
  for (let p = 0; p < w * h; p += 1) {
    const i = p * 4
    if (data[i + 3] > 128 && isWhiteish(data[i], data[i + 1], data[i + 2])) mask[p] = 1
  }
  const comps = components(mask, w, h).filter((c) => c.length >= MIN_SIZE)
  const total = comps.reduce((sum, c) => sum + c.length, 0)
  const info = comps
    .map((c) => {
      let x0 = w, y0 = h, x1 = 0, y1 = 0
      for (const p of c) {
        const x = p % w, y = (p / w) | 0
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
      return `${c.length}px(${x1 - x0 + 1}x${y1 - y0 + 1})`
    })
    .join(' ')
  console.log(`${file}: comps=${comps.length} total=${total}  ${info}`)

  const ox = (index % COLS) * CELL_W + 10
  const oy = Math.floor(index / COLS) * CELL_H + 10
  const scale = Math.min((CELL_W - 20) / w, (CELL_H - 20) / h)
  const removed = new Uint8Array(w * h)
  for (const c of comps) for (const p of c) removed[p] = 1
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const si = (y * w + x) * 4
      const a = (data[si + 3] / 255) * 0.45
      const di = ((oy + Math.round(y * scale)) * sheet.width + ox + Math.round(x * scale)) * 4
      sheet.data[di] = Math.round(data[si] * a + sheet.data[di] * (1 - a))
      sheet.data[di + 1] = Math.round(data[si + 1] * a + sheet.data[di + 1] * (1 - a))
      sheet.data[di + 2] = Math.round(data[si + 2] * a + sheet.data[di + 2] * (1 - a))
      if (removed[y * w + x]) {
        sheet.data[di] = 40
        sheet.data[di + 1] = 230
        sheet.data[di + 2] = 60
      }
    }
  }
})

const out = fileURLToPath(new URL('../src/assets/_tmp/instruments-whiten-preview.png', import.meta.url))
fs.writeFileSync(out, PNG.sync.write(sheet))
console.log('preview:', out)
