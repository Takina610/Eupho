import { useEffect, useRef, useState } from 'react'

import { createQuadRenderer, type QuadRenderer } from '@/lib/webglQuad'

const CSS_WIDTH = 420
const CSS_HEIGHT = 315
/** Reference-site follow curve, slowed to a lazy chase; snaps inside 0.72px. */
const FOLLOW_DIVISOR = 36
const MAX_STEP = 100
const DEADZONE = 0.72
const SPEED_FACTOR = 0.041666666666666664

type HoverArtifactProps = {
  active: boolean
  image: string
}

/**
 * The instrument artwork that chases the pointer while a list row is hovered,
 * distorted by pointer speed (RGB split + vertex bend), like the reference site's
 * StoryDraw plane.
 */
export function HoverArtifact({ active, image }: HoverArtifactProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<QuadRenderer | null>(null)
  const posRef = useRef({ x: 0, y: 0, started: false })
  const targetRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef(0)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      targetRef.current.x = event.clientX
      targetRef.current.y = event.clientY
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = createQuadRenderer(canvas)
    if (!renderer) {
      setSupported(false)
      return
    }
    rendererRef.current = renderer
    renderer.resize(CSS_WIDTH, CSS_HEIGHT, Math.min(window.devicePixelRatio || 1, 2))
    return () => {
      cancelAnimationFrame(frameRef.current)
      rendererRef.current?.dispose()
      rendererRef.current = null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.src = image
    img
      .decode()
      .then(() => {
        if (!cancelled) rendererRef.current?.setTexture(img)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [image])

  useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer || !active) return
    if (!posRef.current.started) {
      posRef.current.x = targetRef.current.x
      posRef.current.y = targetRef.current.y
      posRef.current.started = true
    }

    const canvas = canvasRef.current
    const loop = () => {
      const pos = posRef.current
      const target = targetRef.current
      const dx = target.x - pos.x
      const dy = target.y - pos.y
      const len = Math.hypot(dx, dy)
      const step = Math.min(Math.max(len / FOLLOW_DIVISOR, 0.03), MAX_STEP)
      const sx = len > DEADZONE ? (dx / len) * step : 0
      const sy = len > DEADZONE ? (dy / len) * step : 0
      pos.x += sx
      pos.y += sy
      if (canvas) {
        canvas.style.transform = `translate3d(${pos.x - CSS_WIDTH / 2}px, ${pos.y - CSS_HEIGHT / 2}px, 0)`
      }
      renderer.draw({ x: sx * SPEED_FACTOR, y: sy * SPEED_FACTOR })
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [active])

  if (!supported) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-show={active}
      className="inst-artifact"
      style={{ width: CSS_WIDTH, height: CSS_HEIGHT }}
    />
  )
}
