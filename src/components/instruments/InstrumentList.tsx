import type { CSSProperties } from 'react'
import { Fragment } from 'react'

import { Reveal } from '@/components/fullpage/Reveal'
import { groupInstruments, INSTRUMENTS, type Instrument } from '@/constants/instruments'

type InstrumentListProps = {
  /** Desktop column fades out while the detail panel is open. */
  visible: boolean
  mobileOpen: boolean
  selectedIndex: number
  onSelect: (index: number) => void
  onPreview: (index: number) => void
  onPreviewEnd: () => void
  /** Desktop pointer enters/leaves the list area (drives the chasing artwork). */
  onListHoverChange: (hovering: boolean) => void
  onCloseMobile: () => void
}

type RowProps = {
  instrument: Instrument
  selected: boolean
  compact?: boolean
  onSelect: () => void
  onPreview: () => void
}

function InstrumentRow({ instrument, selected, compact = false, onSelect, onPreview }: RowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onPreview}
      onFocus={onPreview}
      aria-current={selected || undefined}
      className={`inst-row group relative flex w-full items-baseline gap-3 border-b border-white/50 text-left ${
        compact ? 'py-1.5' : 'py-[0.3rem]'
      }`}
    >
      <span
        className={`inst-row-main relative font-bold ${compact ? 'text-sm' : 'text-[1.2rem] leading-snug'} ${
          selected ? 'text-white' : 'text-white/55'
        }`}
      >
        {instrument.name}
      </span>
      <span
        className={`inst-row-main relative font-semibold uppercase tracking-[0.12em] ${
          compact ? 'text-[0.58rem]' : 'text-[0.78rem]'
        } ${selected ? 'text-white/80' : 'text-white/35'}`}
      >
        {instrument.nameEn}
      </span>
      {!compact && (
        <span className="inst-ghost hidden lg:block" aria-hidden>
          {instrument.nameEn}
        </span>
      )}
    </button>
  )
}

function GroupHeader({ name, nameEn, compact = false }: { name: string; nameEn: string; compact?: boolean }) {
  return (
    <div
      className={`inst-group-header flex items-baseline gap-2 ${compact ? 'mb-0.5 mt-3' : 'mb-1 mt-4'}`}
    >
      <span className={`font-bold ${compact ? 'text-xs' : 'text-base'} text-white/75`}>{name}</span>
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-brand/90">
        {nameEn}
      </span>
    </div>
  )
}

export function InstrumentList({
  visible,
  mobileOpen,
  selectedIndex,
  onSelect,
  onPreview,
  onPreviewEnd,
  onListHoverChange,
  onCloseMobile,
}: InstrumentListProps) {
  const groups = groupInstruments()
  let revealIndex = 0

  return (
    <>
      <nav
        aria-label="乐器列表"
        className={`inst-panel inst-list absolute left-[clamp(1.5rem,8vw,9rem)] top-1/2 z-10 hidden w-[min(50vw,36rem)] -translate-y-1/2 sm:block ${
          visible ? 'visible opacity-100' : 'invisible -translate-x-6 opacity-0'
        }`}
        onMouseEnter={() => onListHoverChange(true)}
        onMouseLeave={() => {
          onListHoverChange(false)
          onPreviewEnd()
        }}
        style={{ '--enter-stagger': '45ms' } as CSSProperties}
      >
        {groups.map(({ group, items }) => (
          <div key={group.id}>
            <Reveal index={revealIndex++}>
              <GroupHeader name={group.name} nameEn={group.nameEn} />
            </Reveal>
            {items.map((item) => {
              const index = INSTRUMENTS.indexOf(item)
              return (
                <Reveal key={item.id} index={revealIndex++}>
                  <InstrumentRow
                    instrument={item}
                    selected={index === selectedIndex}
                    onSelect={() => onSelect(index)}
                    onPreview={() => onPreview(index)}
                  />
                </Reveal>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Mobile: the list becomes a full overlay (detail-first layout below sm). */}
      <div
        data-fullpage-ignore
        aria-hidden={!mobileOpen}
        className={`inst-panel absolute inset-0 z-30 bg-ink/95 backdrop-blur-sm sm:hidden ${
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between pb-2">
            <div>
              <p className="text-base font-bold text-white">乐器一览</p>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand">
                Instruments
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="min-h-11 border border-white/40 px-4 text-xs font-semibold tracking-widest text-white"
            >
              关闭
            </button>
          </div>
          <div className="grid flex-1 grid-cols-2 content-start gap-x-5 overflow-y-auto">
            {groups.map(({ group, items }) => (
              <Fragment key={group.id}>
                <div className="col-span-2">
                  <GroupHeader name={group.name} nameEn={group.nameEn} compact />
                </div>
                {items.map((item) => {
                  const index = INSTRUMENTS.indexOf(item)
                  return (
                    <InstrumentRow
                      key={item.id}
                      instrument={item}
                      compact
                      selected={index === selectedIndex}
                      onSelect={() => onSelect(index)}
                      onPreview={() => onPreview(index)}
                    />
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
