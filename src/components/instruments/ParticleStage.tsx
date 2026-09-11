import { useEffect, useRef, useState } from 'react'

import { usePointerTracker } from '@/hooks/usePointerTracker'
import type { ShapeModel } from '@/hooks/useInstrumentModel'
import { useViewportSize } from '@/hooks/useViewportSize'
import { ParticleField, type ParticleTransform } from '@/lib/particleField'
import { createPointRenderer, type PointRenderer } from '@/lib/webglPoints'

type ParticleStageProps = {
  active: boolean
  shape: ShapeModel | null
  transform: ParticleTransform
  /** Shown instead of particles when WebGL is unavailable. */
  fallbackSrc: string
  fallbackAlt: string
}

/** Clamp round(area / density) into sane bounds so small screens get a lighter field. */
function resolveCount(width: number, height: number) {
  const area = Math.max(width, 1) * Math.max(height, 1)
  return Math.min(7000, Math.max(1600, Math.round(area / 220)))
}

export function ParticleStage({
  active,
  shape,
  transform,
  fallbackSrc,
  fallbackAlt,
}: ParticleStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<PointRenderer | null>(null)
  const fieldRef = useRef<ParticleField | null>(null)
  const frameRef = useRef(0)
  const [supported, setSupported] = useState(true)
  const { width, height } = useViewportSize()

  const pointer = usePointerTracker(canvasRef, active)

  // One-time init: create the GL renderer and the field sized to the first viewport.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = createPointRenderer(canvas)
    if (!renderer) {
      setSupported(false)
      return
    }
    rendererRef.current = renderer
    const isSmall = window.innerWidth < 640
    fieldRef.current = new ParticleField({
      count: resolveCount(window.innerWidth, window.innerHeight),
      view: { width: window.innerWidth, height: window.innerHeight },
      sizeRange: isSmall ? [1.4, 2.4] : [1.8, 3.4],
    })
    return () => {
      cancelAnimationFrame(frameRef.current)
      rendererRef.current?.dispose()
      rendererRef.current = null
      fieldRef.current = null
    }
  }, [])

  useEffect(() => {
    rendererRef.current?.resize(width, height, Math.min(window.devicePixelRatio || 1, 2))
  }, [width, height])

  useEffect(() => {
    fieldRef.current?.setTransform(transform)
  }, [transform])

  // New shape (or re-entering the section) → fresh targets, AK appear()-style.
  useEffect(() => {
    fieldRef.current?.setShape(shape, transform)
  }, [shape, transform, active])

  useEffect(() => {
    const field = fieldRef.current
    const renderer = rendererRef.current
    if (!field || !renderer) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!active || reduced) {
      if (reduced) {
        field.snap()
        renderer.upload(field.positions, field.alphas, field.sizes)
        renderer.draw()
      } else {
        field.scatter()
      }
      return
    }

    const loop = () => {
      field.update(pointer.current)
      renderer.upload(field.positions, field.alphas, field.sizes)
      renderer.draw()
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [active, pointer])

  return (
    <div aria-hidden className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
      {!supported && (
        <img
          src={fallbackSrc}
          alt={fallbackAlt}
          draggable={false}
          className="max-h-[52vh] opacity-70"
          style={{
            position: 'absolute',
            left: `calc(50% + ${transform.x}px)`,
            top: `calc(50% - ${transform.y}px)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  )
}
