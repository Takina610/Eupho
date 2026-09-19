import bassClefSrc from '@/assets/note/低音谱号.svg'

/**
 * Bass-clef staff. The F-clef anchor still comes from `src/assets/note`;
 * timeline glyphs are inline-SVG notes drawn by StaffGlyph.
 * Pitch 1 = bottom line, 9 = top line.
 */
export type StaffGlyphKind = 'quarter' | 'eighth' | 'beamed' | 'sixteenths'

export const STAFF_BASS_CLEF_SRC = bassClefSrc

export type StaffNote = {
  pitch: number
  kind: StaffGlyphKind
}

/** Ten works; pitches follow the opening melody's contour. */
export const SERIES_STAFF_NOTES: readonly StaffNote[] = [
  { pitch: 1, kind: 'quarter' },
  { pitch: 2, kind: 'eighth' },
  { pitch: 3, kind: 'beamed' },
  { pitch: 4, kind: 'sixteenths' },
  { pitch: 5, kind: 'eighth' },
  { pitch: 6, kind: 'quarter' },
  { pitch: 5, kind: 'beamed' },
  { pitch: 7, kind: 'eighth' },
  { pitch: 8, kind: 'sixteenths' },
  { pitch: 9, kind: 'quarter' },
]

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
