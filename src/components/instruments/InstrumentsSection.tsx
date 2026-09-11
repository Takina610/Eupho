import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Section } from '@/components/fullpage/Section'
import { useFullpageOverlayLock } from '@/components/fullpage/FullpagePagerContext'
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
  const setOverlayLock = useFullpageOverlayLock()
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

  useEffect(() => {
    setOverlayLock(detailOpen)
    return () => setOverlayLock(false)
  }, [detailOpen, setOverlayLock])

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

  useEffect(() => {
    if (!detailOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setDetailOpen(false)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [detailOpen, step])

  // Particle cloud placement, mirroring the reference: right of centre in the list,
  // sliding left behind the copy in the detail view; phones keep it on top.
  const transform = useMemo<ParticleTransform>(() => {
    const scale = isNarrow
      ? Math.min(360, Math.max(200, height * 0.4))
      : Math.min(680, Math.max(320, height * 0.6))
    if (isNarrow) {
      return { scale, x: 0, y: height * (detailOpen ? 0.15 : 0.18) }
    }
    return detailOpen
      ? { scale: scale * 0.85, x: -width * 0.16, y: height * 0.04 }
      : { scale, x: width * 0.17, y: height * 0.02 }
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
      <ParticleStage
        active={active}
        shape={shape}
        transform={transform}
        fallbackSrc={preview.image}
        fallbackAlt={preview.name}
      />
      <div className="inst-glow" aria-hidden />
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
