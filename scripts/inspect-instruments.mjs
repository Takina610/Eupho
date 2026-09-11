import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const dir = fileURLToPath(new URL('../src/assets/instruments/', import.meta.url))

function isNearWhite(r, g, b) {
  return r > 235 && g > 235 && b > 235
}

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort()) {
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, file)))
  const { width: w, height: h, data } = png
  let opaque = 0
  let whiteOpaque = 0
  let borderOpaque = 0
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4
      if (data[i + 3] > 200) {
        opaque += 1
        if (isNearWhite(data[i], data[i + 1], data[i + 2])) whiteOpaque += 1
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) borderOpaque += 1
      }
    }
  }
  // corners
  const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4].map((i) => {
    const a = data[i + 3]
    return a > 200 ? `A${data[i]},${data[i + 1]},${data[i + 2]}` : 'T'
  })
  console.log(
    `${file}  opaque=${((opaque / (w * h)) * 100).toFixed(1)}%  whiteOpaque=${((whiteOpaque / (w * h)) * 100).toFixed(1)}%  borderOpaque=${borderOpaque}  corners=[${corners.join(' ')}]`,
  )
}
