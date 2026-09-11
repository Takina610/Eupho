import type { ShapeModel } from '@/hooks/useInstrumentModel'

export type PointerState = { x: number; y: number; active: boolean }

export type ParticleTransform = { scale: number; x: number; y: number }

const SCATTER_ALPHA = -0.5
const SCATTER_JITTER = 100
/** AK "SPREAD" mode: particles flee the pointer, then ease back into the shape. */
const REPEL_STRENGTH = -100

type FieldOptions = {
  count: number
  view: { width: number; height: number }
  sizeRange?: [number, number]
  speedRange?: [number, number]
}

/**
 * Screen-space particle field: every particle eases toward its target point with a
 * per-particle factor of 1/speed (AK uses speed in [20, 30]), gets pushed away from the
 * pointer with strength -100 * (pointer - p) / (1 + d^2), and scatters by jittering its
 * own target while fading out.
 */
export class ParticleField {
  readonly count: number
  readonly positions: Float32Array
  readonly alphas: Float32Array
  readonly sizes: Float32Array

  private speeds: Float32Array
  private targets: Float32Array | null = null
  private targetCount = 0
  private transform: ParticleTransform = { scale: 1, x: 0, y: 0 }

  constructor({ count, view, sizeRange = [1.8, 3.4], speedRange = [20, 30] }: FieldOptions) {
    this.count = count
    this.positions = new Float32Array(count * 2)
    this.alphas = new Float32Array(count)
    this.sizes = new Float32Array(count)
    this.speeds = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      this.positions[i * 2] = (Math.random() - 0.5) * view.width
      this.positions[i * 2 + 1] = (Math.random() - 0.5) * view.height
      this.alphas[i] = SCATTER_ALPHA
      this.sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
      this.speeds[i] = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0])
    }
  }

  /** Bind a shape (normalized points, y up, unit height) and the current transform. */
  setShape(shape: ShapeModel | null, transform: ParticleTransform) {
    this.transform = transform
    if (!shape || shape.points.length === 0) {
      this.targets = null
      this.targetCount = 0
      return
    }

    const source = shape.points
    const triplets = Math.floor(source.length / 3)
    const targetCount = Math.min(this.count, triplets)
    const targets = new Float32Array(targetCount * 3)
    // Fisher-Yates over triplet indices so every particle flies to a random spot of the shape.
    const order = new Uint32Array(triplets)
    for (let i = 0; i < triplets; i += 1) order[i] = i
    for (let i = triplets - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = order[i]
      order[i] = order[j]
      order[j] = tmp
    }

    for (let i = 0; i < targetCount; i += 1) {
      const src = order[i] * 3
      targets[i * 3] = source[src] * transform.scale
      targets[i * 3 + 1] = source[src + 1] * transform.scale
      targets[i * 3 + 2] = source[src + 2]
    }

    this.targets = targets
    this.targetCount = targetCount
  }

  setTransform(transform: ParticleTransform) {
    this.transform = transform
  }

  /** AK disappear(): jitter every target in place and fade the shape out. */
  scatter() {
    const targets = this.targets
    if (!targets) return
    for (let i = 0; i < targets.length; i += 3) {
      targets[i] += (Math.random() - 0.5) * SCATTER_JITTER
      targets[i + 1] += (Math.random() - 0.5) * SCATTER_JITTER
      targets[i + 2] = SCATTER_ALPHA
    }
  }

  /** Advance one frame; positions/alphas are the buffers to upload. */
  update(pointer: PointerState) {
    const { positions, alphas, targets, targetCount, transform } = this
    for (let i = 0; i < this.count; i += 1) {
      const s = 1 / this.speeds[i]
      const px = i * 2
      const tx = targets && i < targetCount ? targets[i * 3] + transform.x : positions[px]
      const ty =
        targets && i < targetCount ? targets[i * 3 + 1] + transform.y : positions[px + 1]
      const ta = targets && i < targetCount ? targets[i * 3 + 2] : SCATTER_ALPHA

      positions[px] += (tx - positions[px]) * s
      positions[px + 1] += (ty - positions[px + 1]) * s
      alphas[i] += (ta - alphas[i]) * s

      if (pointer.active) {
        const gx = pointer.x - positions[px]
        const gy = pointer.y - positions[px + 1]
        const falloff = 1 / (1 + gx * gx + gy * gy)
        positions[px] += REPEL_STRENGTH * gx * falloff
        positions[px + 1] += REPEL_STRENGTH * gy * falloff
      }
    }
  }

  /** Reduced motion: place every particle directly on its visible target. */
  snap() {
    const { positions, alphas, targets, targetCount, transform } = this
    for (let i = 0; i < this.count; i += 1) {
      const px = i * 2
      if (targets && i < targetCount) {
        positions[px] = targets[i * 3] + transform.x
        positions[px + 1] = targets[i * 3 + 1] + transform.y
        alphas[i] = Math.max(targets[i * 3 + 2], 0)
      } else {
        alphas[i] = 0
      }
    }
  }
}
