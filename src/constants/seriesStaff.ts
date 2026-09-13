import beamedSrc from '@/assets/note/双八分音符.svg'
import eighthSrc from '@/assets/note/八分音符.svg'
import flatSrc from '@/assets/note/降号.svg'
import quarterSrc from '@/assets/note/四分音符.svg'
import restSrc from '@/assets/note/八分休止符.svg'
import sixteenthsSrc from '@/assets/note/双十六分音符.svg'
import trebleSrc from '@/assets/note/高音谱号.svg'
import bassClefSrc from '@/assets/note/低音谱号.svg'

/**
 * Bass-clef staff. Timeline glyphs + staff F-clef all come from `src/assets/note`.
 * Pitch 1 = bottom line, 9 = top line.
 */
export type StaffGlyphKind =
  | 'quarter'
  | 'eighth'
  | 'beamed'
  | 'sixteenths'
  | 'rest'
  | 'flat'
  | 'treble'

export const STAFF_BASS_CLEF_SRC = bassClefSrc

export const STAFF_NOTE_SRC: Record<StaffGlyphKind, string> = {
  quarter: quarterSrc,
  eighth: eighthSrc,
  beamed: beamedSrc,
  sixteenths: sixteenthsSrc,
  rest: restSrc,
  flat: flatSrc,
  treble: trebleSrc,
}

export const STAFF_NOTE_ASSETS = [
  bassClefSrc,
  quarterSrc,
  eighthSrc,
  beamedSrc,
  sixteenthsSrc,
  restSrc,
  flatSrc,
  trebleSrc,
] as const

export type StaffNote = {
  pitch: number
  kind: StaffGlyphKind
}

/** Ten works; each timeline glyph appears at least once. */
export const SERIES_STAFF_NOTES: readonly StaffNote[] = [
  { pitch: 1, kind: 'quarter' },
  { pitch: 2, kind: 'eighth' },
  { pitch: 3, kind: 'beamed' },
  { pitch: 4, kind: 'sixteenths' },
  { pitch: 5, kind: 'flat' },
  { pitch: 6, kind: 'treble' },
  { pitch: 5, kind: 'rest' },
  { pitch: 7, kind: 'eighth' },
  { pitch: 8, kind: 'beamed' },
  { pitch: 9, kind: 'quarter' },
]

const MARK_KINDS: ReadonlySet<StaffGlyphKind> = new Set(['rest', 'flat', 'treble'])
const WIDE_KINDS: ReadonlySet<StaffGlyphKind> = new Set(['beamed', 'sixteenths'])

export function seriesStaffNote(index: number): StaffNote {
  return SERIES_STAFF_NOTES[index] ?? { pitch: 4, kind: 'quarter' }
}

export function seriesStaffPitch(index: number) {
  return seriesStaffNote(index).pitch
}

export function staffNoteStemDown(note: StaffNote) {
  return (note.kind === 'quarter' || note.kind === 'eighth') && note.pitch >= 5
}

export function staffNoteWide(note: StaffNote) {
  return WIDE_KINDS.has(note.kind)
}

export function staffNoteMark(note: StaffNote) {
  return MARK_KINDS.has(note.kind)
}
