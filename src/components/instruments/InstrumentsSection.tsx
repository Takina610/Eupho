import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Section } from '@/components/fullpage/Section'
import { IndexBackground } from '@/components/fullpage/IndexBackground'
import { DEFAULT_INSTRUMENT_ID, INSTRUMENTS } from '@/constants/instruments'
import { useInstrumentModels } from '@/hooks/useInstrumentModel'
import { useViewportSize } from '@/hooks/useViewportSize'
import type { ParticleTransform } from '@/lib/particleField'

import { InstrumentDetail } from './InstrumentDetail'
import { HoverArtifact } from './HoverArtifact'
import { InstrumentList } from './InstrumentList'
import { ParticleStage } from './ParticleStage'
import './instruments.css'

const INITIAL_INDEX = Math.max(
  0,
  INSTRUMENTS.findIndex((instrument) => instrument.id === DEFAULT_INSTRUMENT_ID),
)

export function InstrumentsSection({ active = false }: { active?: boolean }) {
  const { width, height } = useViewportSize()
  const isNarrow = width < 640

  const [selectedIndex, setSelectedIndex] = useState(INITIAL_INDEX)
  const [previewIndex, setPreviewIndex] = useState(INITIAL_INDEX)
  // Phones start in the detail view (reference site behaviour); desktop shows the list.
  const [detailOpen, setDetailOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches,
  )
  const [listOpen, setListOpen] = useState(false)
  // Desktop only: hovering a list row shows the chasing artwork near the pointer.
  const canHover = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(any-hover: hover)').matches,
    [],
  )
  const [rowsHovered, setRowsHovered] = useState(false)

  // Follow viewport flips (e.g. an early resize before first paint settles) until the
  // user has interacted; afterwards their explicit list/detail choice sticks.
  const interactedRef = useRef(false)
  const narrowRef = useRef(isNarrow)
  useEffect(() => {
    if (interactedRef.current || narrowRef.current === isNarrow) return
    narrowRef.current = isNarrow
    setDetailOpen(isNarrow)
  }, [isNarrow])

  const markInteracted = useCallback(() => {
    interactedRef.current = true
  }, [])

  const { models, loadModel } = useInstrumentModels()
  const preview = INSTRUMENTS[previewIndex] ?? INSTRUMENTS[0]
  useEffect(() => {
    loadModel(preview.id, preview.image)
  }, [preview, loadModel])
  const shape = models[preview.id] ?? null

  const step = useCallback((delta: 1 | -1) => {
    setSelectedIndex((prev) => {
      const next = (prev + delta + INSTRUMENTS.length) % INSTRUMENTS.length
      setPreviewIndex(next)
      return next
    })
  }, [])

  // Keyboard control for the detail view. This listener registers before the fullpage
  // pager's (child effects run first), so handled keys are stopped here to keep the
  // pager from also treating Left/Right as page turns — Up/Down/Escape stay free.
  useEffect(() => {
    if (!detailOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        setDetailOpen(false)
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopImmediatePropagation()
        markInteracted()
        step(event.key === 'ArrowRight' ? 1 : -1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [detailOpen, step, markInteracted])

  // Particle cloud placement: tucked close to the copy on both sides of the screen —
  // beside the list in list mode, sliding behind the copy in the detail view.
  const transform = useMemo<ParticleTransform>(() => {
    const scale = isNarrow
      ? Math.min(480, Math.max(280, height * 0.55))
      : Math.min(860, Math.max(400, height * 0.76))
    if (isNarrow) {
      return { scale, x: 0, y: height * (detailOpen ? 0.15 : 0.18) }
    }
    return detailOpen
      ? { scale: scale * 0.9, x: -width * 0.1, y: height * 0.04 }
      : { scale, x: width * 0.1, y: height * 0.02 }
  }, [detailOpen, height, isNarrow, width])

  const openInstrument = useCallback(
    (index: number) => {
      interactedRef.current = true
      setSelectedIndex(index)
      setPreviewIndex(index)
      setDetailOpen(true)
      setListOpen(false)
    },
    [],
  )

  const jumpTo = useCallback((index: number) => {
    setSelectedIndex(index)
    setPreviewIndex(index)
  }, [])

  const selected = INSTRUMENTS[selectedIndex] ?? INSTRUMENTS[0]

  return (
    <Section id="instruments" className="bg-ink">
      <h2 className="sr-only">北宇治高校吹奏乐部 乐器</h2>
      <IndexBackground />
      <ParticleStage
        active={active}
        shape={shape}
        transform={transform}
        fallbackSrc={preview.image}
        fallbackAlt={preview.name}
      />
      <div className="inst-grid" aria-hidden />
      <div className="inst-watermark" aria-hidden>
        INSTRUMENTS
      </div>
      <InstrumentList
        visible={!detailOpen}
        mobileOpen={listOpen}
        selectedIndex={selectedIndex}
        onSelect={openInstrument}
        onPreview={setPreviewIndex}
        onPreviewEnd={() => setPreviewIndex(selectedIndex)}
        onListHoverChange={setRowsHovered}
        onCloseMobile={() => setListOpen(false)}
      />
      <HoverArtifact
        active={active && canHover && rowsHovered && !detailOpen}
        image={preview.image}
      />
      <InstrumentDetail
        instrument={selected}
        index={selectedIndex}
        open={detailOpen}
        onStep={(delta) => {
          markInteracted()
          step(delta)
        }}
        onJump={(index) => {
          markInteracted()
          jumpTo(index)
        }}
        onClose={() => {
          markInteracted()
          setDetailOpen(false)
        }}
        onOpenList={() => {
          markInteracted()
          setListOpen(true)
        }}
      />
    </Section>
  )
}
