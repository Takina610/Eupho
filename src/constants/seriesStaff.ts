import bassClefSrc from '@/assets/note/低音谱号.svg'

/**
 * Bass-clef staff. The F-clef anchor still comes from `src/assets/note`;
 * timeline glyphs are inline-SVG notes drawn by StaffGlyph, and consecutive
 * notes are connected into beamed groups by StaffBeams — the timeline reads
 * as an engraved melodic phrase, not scattered symbols.
 * Pitch 1 = bottom line, 9 = top line.
 */
export type StaffGlyphKind = 'quarter' | 'half' | 'eighth'

export const STAFF_BASS_CLEF_SRC = bassClefSrc

export type StaffNote = {
  pitch: number
  /** quarter = solid head, half = hollow head (a held note, phrase endings). */
  rhythm: 'quarter' | 'half'
}

/** Ten works; pitches follow the opening melody's contour. */
export const SERIES_STAFF_NOTES: readonly StaffNote[] = [
  { pitch: 1, rhythm: 'quarter' },
  { pitch: 2, rhythm: 'quarter' },
  { pitch: 3, rhythm: 'quarter' },
  { pitch: 4, rhythm: 'quarter' },
  { pitch: 5, rhythm: 'quarter' },
  { pitch: 6, rhythm: 'quarter' },
  { pitch: 5, rhythm: 'half' },
  { pitch: 7, rhythm: 'quarter' },
  { pitch: 8, rhythm: 'quarter' },
  { pitch: 9, rhythm: 'half' },
]

/**
 * Beam groups: connects `start` with `start + 1` into one beamed pair
 * (double beams read as sixteenths). Groups follow the engraved convention —
 * stems up below the middle line, down above it.
 */
export const STAFF_BEAM_GROUPS: readonly { start: number; double?: boolean }[] = [
  { start: 1 },
  { start: 4, double: true },
  { start: 7 },
]

/** Key signature of B♭ major written after the clef: flats on B (line 3) and E (space 6). */
export const STAFF_KEY_FLAT_PITCHES: readonly number[] = [3, 6]

export function seriesStaffNote(index: number): StaffNote {
  return SERIES_STAFF_NOTES[index] ?? { pitch: 4, rhythm: 'quarter' }
}

export function seriesStaffPitch(index: number) {
  return seriesStaffNote(index).pitch
}

export function staffNoteStemDown(note: StaffNote) {
  return note.pitch >= 5
}
