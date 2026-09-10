import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

type SeamParticlesProps = {
  p: number
  active: boolean
}

export function SeamParticles({ p, active }: SeamParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pRef = useRef(p)
  const activeRef = useRef(active)
  pRef.current = p
  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) {
      return
    }

    const particles: Particle[] = []
    let raf = 0
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const tick = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      ctx.clearRect(0, 0, width, height)

      if (activeRef.current) {
        const seamX = pRef.current * width
        const spawn = particles.length < 36 ? 2 : 0
        for (let i = 0; i < spawn; i += 1) {
          const dir = Math.random() > 0.5 ? 1 : -1
          particles.push({
            x: seamX,
            y: Math.random() * height,
            vx: dir * (0.8 + Math.random() * 2.2),
            vy: (Math.random() - 0.5) * 1.8,
            life: 20 + Math.random() * 22,
            maxLife: 42,
            size: 1 + Math.random() * 2,
          })
        }

        for (let i = particles.length - 1; i >= 0; i -= 1) {
          const particle = particles[i]
          if (!particle) {
            continue
          }
          particle.x += particle.vx
          particle.y += particle.vy
          particle.life -= 1
          if (particle.life <= 0) {
            particles.splice(i, 1)
            continue
          }
          ctx.fillStyle = `rgba(255,255,255,${(particle.life / particle.maxLife) * 0.7})`
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
        }
      } else if (particles.length) {
        particles.length = 0
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    />
  )
}
