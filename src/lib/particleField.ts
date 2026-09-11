import type { ShapeModel } from '@/hooks/useInstrumentModel'

export type PointerState = { x: number; y: number; active: boolean }

export type ParticleTransform = { scale: number; x: number; y: number }

export type ViewState = { width: number; height: number }

const SCATTER_ALPHA = -0.5
const SCATTER_JITTER = 100
/** AK "SPREAD" mode: particles flee the pointer, then ease back into the shape. */
const REPEL_STRENGTH = -100
/** Frames a particle waits before its alpha starts easing in — the shape refines in waves. */
const REVEAL_SPREAD = 130
/** Curved approach: perpendicular sinusoid while a particle is still far from its target. */
const WOBBLE_AMPLITUDE = 16
const WOBBLE_RANGE = 320
const TAU = Math.PI * 2

type FieldOptions = {
  count: number
  /** Ambient sparks that slowly rise past the shape (the reference site's fireflies). */
  flyCount?: number
  view: ViewState
  sizeRange?: [number, number]
  speedRange?: [number, number]
}

/**
 * Screen-space particle field: every particle eases toward its target point with a
 * per-particle factor of 1/speed, gets pushed away from the pointer with strength
 * -100 * (pointer - p) / (1 + d^2), scatters by jittering its own target while fading
 * out, and condenses into view with staggered alpha reveals and curved approaches.
 */
export class ParticleField {
  readonly count: number
  readonly total: number
  readonly positions: Float32Array
  readonly alphas: Float32Array
  readonly sizes: Float32Array

  private speeds: Float32Array
  private reveals: Float32Array
  private phases: Float32Array
  private targets: Float32Array | null = null
  private targetCount = 0
  private transform: ParticleTransform = { scale: 1, x: 0, y: 0 }
  private view: ViewState
  private ambient = 0
  private ambientTarget = 0
  private tick = 0

  // Firefly state (indices count..total-1 of the buffers).
  private flyCount: number
  private flySpeeds: Float32Array
  private flyLives: Float32Array

  constructor({ count, flyCount = 0, view, sizeRange = [1.5, 2.8], speedRange = [24, 44] }: FieldOptions) {
    this.count = count
    this.total = count + flyCount
    this.flyCount = flyCount
    this.view = view
    this.positions = new Float32Array(this.total * 2)
    this.alphas = new Float32Array(this.total)
    this.sizes = new Float32Array(this.total)
    this.speeds = new Float32Array(count)
    this.reveals = new Float32Array(count)
    this.phases = new Float32Array(count)
    this.flySpeeds = new Float32Array(flyCount)
    this.flyLives = new Float32Array(flyCount)

    for (let i = 0; i < count; i += 1) {
      this.positions[i * 2] = (Math.random() - 0.5) * view.width
      this.positions[i * 2 + 1] = (Math.random() - 0.5) * view.height
      this.alphas[i] = SCATTER_ALPHA
      this.sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
      this.speeds[i] = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0])
      this.reveals[i] = Math.random() * REVEAL_SPREAD
      this.phases[i] = Math.random() * TAU
    }

    const flySize: [number, number] = view.width < 640 ? [3.5, 5] : [4.5, 7]
    for (let j = 0; j < flyCount; j += 1) {
      this.resetFly(j, false)
      const i = count + j
      this.sizes[i] = flySize[0] + Math.random() * (flySize[1] - flySize[0])
      this.alphas[i] = SCATTER_ALPHA
    }
  }

  /** Place a firefly near the bottom of the screen with a fresh life and rise speed. */
  private resetFly(j: number, atBottom = true) {
    const { view } = this
    this.positions[(this.count + j) * 2] = (Math.random() - 0.5) * view.width * 0.9
    this.positions[(this.count + j) * 2 + 1] = atBottom
      ? -view.height * (0.3 + Math.random() * 0.25)
      : (Math.random() - 0.5) * view.height
    this.flySpeeds[j] = 0.12 + Math.random() * 0.18
    this.flyLives[j] = 60 + Math.random() * 1140
  }

  setView(view: ViewState) {
    this.view = view
  }

  setAmbient(on: boolean) {
    this.ambientTarget = on ? 1 : 0
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
    // Every switch refines in a fresh wave of arrivals.
    for (let i = 0; i < this.count; i += 1) this.reveals[i] = Math.random() * REVEAL_SPREAD
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
    this.tick += 1
    this.ambient += (this.ambientTarget - this.ambient) * 0.05
    const { positions, alphas, targets, targetCount, transform } = this

    for (let i = 0; i < this.count; i += 1) {
      const s = 1 / this.speeds[i]
      const px = i * 2
      let tx = targets && i < targetCount ? targets[i * 3] + transform.x : positions[px]
      let ty =
        targets && i < targetCount ? targets[i * 3 + 1] + transform.y : positions[px + 1]
      let ta = targets && i < targetCount ? targets[i * 3 + 2] : SCATTER_ALPHA

      // Curved approach: bend the remaining path with a perpendicular sinusoid.
      const dx = tx - positions[px]
      const dy = ty - positions[px + 1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 1) {
        const wob =
          Math.sin(this.tick * 0.03 + this.phases[i]) *
          WOBBLE_AMPLITUDE *
          Math.min(dist / WOBBLE_RANGE, 1)
        tx += (-dy / dist) * wob
        ty += (dx / dist) * wob
      }

      // Staggered reveal: alpha only starts easing in once this particle's turn arrives.
      if (this.reveals[i] > 0) {
        this.reveals[i] -= 1
        ta = 0
      }

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

    for (let j = 0; j < this.flyCount; j += 1) {
      const i = this.count + j
      const px = i * 2
      this.flyLives[j] -= 1
      positions[px + 1] += this.flySpeeds[j]
      const gone =
        this.flyLives[j] <= 0 || positions[px + 1] > this.view.height * 0.6
      if (gone) {
        this.resetFly(j)
        alphas[i] = SCATTER_ALPHA
        continue
      }
      const ta = this.ambient * (this.flyLives[j] < 30 ? 0 : 1) * 0.6
      alphas[i] += (ta - alphas[i]) * 0.08
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
    for (let j = 0; j < this.flyCount; j += 1) alphas[this.count + j] = 0
  }
}
