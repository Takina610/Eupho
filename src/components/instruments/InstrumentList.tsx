import type { CSSProperties } from 'react'
import { Fragment } from 'react'

import { Reveal } from '@/components/fullpage/Reveal'
import { groupInstruments, INSTRUMENTS, type Instrument } from '@/constants/instruments'

type InstrumentListProps = {
  /** Desktop column fades out while the detail panel is open. */
  visible: boolean
  /** Section is scrolling away: rows cascade out like the detail exit. */
  leaving: boolean
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
      className={`inst-row group relative block w-full border-b border-white/50 text-left ${
        compact ? 'py-1.5' : 'h-[3.95vh]'
      }`}
    >
      <span
        className={`inst-row-main relative font-bold ${compact ? 'flex items-baseline gap-3 text-sm' : 'absolute bottom-[0.55vh] left-0 flex w-full items-baseline gap-3 text-[clamp(1.2rem,2.4vh,1.65rem)] leading-none'} ${
          selected ? 'text-white' : 'text-white/55'
        }`}
      >
        {instrument.name}
        <span
          className={`inst-row-main relative font-semibold uppercase tracking-[0.12em] ${
            compact ? 'text-[0.58rem]' : 'text-[clamp(0.78rem,1.55vh,1.05rem)]'
          } ${selected ? 'text-white/80' : 'text-white/35'}`}
        >
          {instrument.nameEn}
        </span>
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
      className={`inst-group-header flex select-none items-baseline gap-2 ${compact ? 'mb-0.5 mt-3' : 'mb-[0.5vh] mt-[1.3vh]'}`}
    >
      <span className={`font-bold ${compact ? 'text-xs' : 'text-[clamp(1.05rem,2.3vh,1.4rem)]'} text-white/75`}>{name}</span>
      <span className="text-[0.75rem] font-semibold uppercase tracking-[0.32em] text-brand/90">
        {nameEn}
      </span>
    </div>
  )
}

export function InstrumentList({
  visible,
  leaving,
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
  let overlayIndex = 0

  return (
    <>
      {/* Desktop: opening the detail cascades the rows out to the left (see
          .inst-list rules in instruments.css); closing cascades them back in. */}
      <nav
        aria-label="乐器列表"
        data-hidden={visible ? undefined : true}
        data-leaving={leaving && visible ? true : undefined}
        className="inst-panel inst-list absolute left-[clamp(1.5rem,8vw,9rem)] top-1/2 z-10 hidden w-[min(58vw,44rem)] -translate-y-1/2 sm:block"
        onMouseEnter={() => onListHoverChange(true)}
        onMouseLeave={() => {
          onListHoverChange(false)
          onPreviewEnd()
        }}
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

      {/* Mobile: the list becomes a full overlay (detail-first layout below sm).
          Rows cascade in from the left on open and back out on close. */}
      <div
        data-fullpage-ignore
        aria-hidden={!mobileOpen}
        data-open={mobileOpen || undefined}
        className={`inst-panel inst-overlay absolute inset-0 z-30 bg-ink/95 backdrop-blur-sm sm:hidden ${
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
                <div
                  className="inst-overlay-item col-span-2"
                  style={{ '--i': overlayIndex++ } as CSSProperties}
                >
                  <GroupHeader name={group.name} nameEn={group.nameEn} compact />
                </div>
                {items.map((item) => {
                  const index = INSTRUMENTS.indexOf(item)
                  return (
                    <div
                      key={item.id}
                      className="inst-overlay-item"
                      style={{ '--i': overlayIndex++ } as CSSProperties}
                    >
                      <InstrumentRow
                        instrument={item}
                        compact
                        selected={index === selectedIndex}
                        onSelect={() => onSelect(index)}
                        onPreview={() => onPreview(index)}
                      />
                    </div>
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
