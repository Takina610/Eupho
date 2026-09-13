import { STAFF_NOTE_SRC, type StaffGlyphKind } from '@/constants/seriesStaff'

export function StaffGlyph({ kind }: { kind: StaffGlyphKind }) {
  return (
    <span className="series-staff__glyph">
      <span className="series-staff__motion">
        <img className="series-staff__shape" src={STAFF_NOTE_SRC[kind]} alt="" draggable={false} aria-hidden />
      </span>
    </span>
  )
}
