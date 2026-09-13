import { prefersReducedMotion } from '@/lib/motion'

const PITCH_HZ = [98, 110, 116.5, 130.8, 146.8, 155.6, 174.6, 196, 220]

let context: AudioContext | null = null

function audioContext() {
  const Ctor = window.AudioContext
  if (!Ctor) {
    return null
  }
  context ??= new Ctor()
  return context
}

export function unlockStaffTone() {
  const ctx = audioContext()
  if (ctx?.state === 'suspended') {
    void ctx.resume()
  }
}

/** Short low-register ping for the selected staff degree. Quiet enough to scrub. */
export function playStaffTone(pitch: number) {
  if (prefersReducedMotion()) {
    return
  }
  const ctx = audioContext()
  if (!ctx) {
    return
  }
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }
  const hz = PITCH_HZ[Math.min(Math.max(pitch, 1), 9) - 1] ?? 147
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(hz, t)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(820, t)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.05, t + 0.016)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.28)
}
