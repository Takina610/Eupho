import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const dir = fileURLToPath(new URL('../src/assets/instruments/', import.meta.url))
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort()
const CELL_W = 330
const CELL_H = 250
const COLS = 4
const rows = Math.ceil(files.length / COLS)

const sheet = new PNG({ width: CELL_W * COLS, height: CELL_H * rows })
// magenta background to expose opaque white remnants
for (let i = 0; i < sheet.data.length; i += 4) {
  sheet.data[i] = 120
  sheet.data[i + 1] = 20
  sheet.data[i + 2] = 90
  sheet.data[i + 3] = 255
}

files.forEach((file, index) => {
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, file)))
  const ox = (index % COLS) * CELL_W + Math.floor((CELL_W - png.width) / 2)
  const oy = Math.floor(index / COLS) * CELL_H + Math.floor((CELL_H - png.height) / 2)
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const si = (y * png.width + x) * 4
      const a = png.data[si + 3] / 255
      const di = ((oy + y) * sheet.width + ox + x) * 4
      sheet.data[di] = Math.round(png.data[si] * a + sheet.data[di] * (1 - a))
      sheet.data[di + 1] = Math.round(png.data[si + 1] * a + sheet.data[di + 1] * (1 - a))
      sheet.data[di + 2] = Math.round(png.data[si + 2] * a + sheet.data[di + 2] * (1 - a))
    }
  }
})

const out = fileURLToPath(new URL('../src/assets/_tmp/instruments-sheet.png', import.meta.url))
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, PNG.sync.write(sheet))
console.log('sheet written:', out)
