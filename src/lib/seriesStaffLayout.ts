const PITCH_MIN = 1
const PITCH_MAX = 9

/** Five-line band, matching `.series-staff__lines`. */
export const STAFF_LINE_TOP = 18
export const STAFF_LINE_BOTTOM = 82

/** Bass F line: 2nd from the top / 4th from the bottom. */
export const STAFF_F_LINE = STAFF_LINE_TOP + (STAFF_LINE_BOTTOM - STAFF_LINE_TOP) * 0.25

/**
 * `低音谱号.svg` dots sit near 17.8% and 45.7% of the glyph height.
 * Size so those dots straddle one staff-space around the F line.
 */
const CLEF_DOT_MID = 0.3175
export const CLEF_HEIGHT = 64
export const CLEF_TOP = STAFF_F_LINE - CLEF_DOT_MID * CLEF_HEIGHT

/** Leave the F-clef its own column on the left of the staff. */
const NOTE_PAD_START = 16
const NOTE_PAD_END = 3.5

export function noteLeftPercent(index: number, count: number) {
  if (count <= 1) {
    return 50
  }
  return NOTE_PAD_START + (index / (count - 1)) * (100 - NOTE_PAD_START - NOTE_PAD_END)
}

/** Pitch 1 = bottom line, 9 = top line; spaces are the even steps. */
export function pitchTopPercent(pitch: number) {
  const clamped = Math.min(Math.max(pitch, PITCH_MIN), PITCH_MAX)
  return (
    STAFF_LINE_BOTTOM -
    ((clamped - PITCH_MIN) / (PITCH_MAX - PITCH_MIN)) * (STAFF_LINE_BOTTOM - STAFF_LINE_TOP)
  )
}

export function nearestNoteIndex(field: HTMLElement, clientX: number, count: number) {
  if (count <= 0) {
    return 0
  }
  const rect = field.getBoundingClientRect()
  if (rect.width <= 0) {
    return 0
  }
  const pct = ((clientX - rect.left) / rect.width) * 100
  let best = 0
  let bestDist = Number.POSITIVE_INFINITY
  for (let index = 0; index < count; index += 1) {
    const dist = Math.abs(noteLeftPercent(index, count) - pct)
    if (dist < bestDist) {
      bestDist = dist
      best = index
    }
  }
  return best
}
