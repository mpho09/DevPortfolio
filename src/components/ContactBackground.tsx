import { useEffect, useRef } from 'react'

/**
 * Lightweight 2D-canvas dot field: points ripple in slow waves and are pushed
 * away from the cursor. Pauses when off-screen; renders one still frame when
 * the user prefers reduced motion.
 */
export function ContactBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    const gap = 26
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    let raf = 0
    let running = false
    let t = 0

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / gap) + 1
      rows = Math.ceil(h / gap) + 1
    }

    const draw = () => {
      t += 0.012
      mouse.x += (mouse.tx - mouse.x) * 0.12
      mouse.y += (mouse.ty - mouse.y) * 0.12
      ctx.clearRect(0, 0, w, h)
      const radius = 170
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let x = i * gap
          let y = j * gap
          const wave = Math.sin(i * 0.22 + t * 2) * Math.cos(j * 0.18 + t * 1.4)
          y += wave * 4
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.hypot(dx, dy)
          let boost = 0
          if (dist < radius) {
            const f = 1 - dist / radius
            const push = f * f * 22
            x += (dx / (dist || 1)) * push
            y += (dy / (dist || 1)) * push
            boost = f
          }
          const u = i / cols
          // Blue → violet → cyan across the width
          const rC = u < 0.5 ? 61 + (139 - 61) * (u * 2) : 139 + (34 - 139) * ((u - 0.5) * 2)
          const gC = u < 0.5 ? 123 + (92 - 123) * (u * 2) : 92 + (211 - 92) * ((u - 0.5) * 2)
          const bC = u < 0.5 ? 255 + (246 - 255) * (u * 2) : 246 + (238 - 246) * ((u - 0.5) * 2)
          const alpha = 0.22 + (wave + 1) * 0.16 + boost * 0.6
          const size = 1.4 + (wave + 1) * 0.45 + boost * 2.4
          ctx.fillStyle = `rgba(${rC | 0},${gC | 0},${bC | 0},${alpha})`
          ctx.fillRect(x - size / 2, y - size / 2, size, size)
        }
      }
      if (running) raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.tx = e.clientX - r.left
      mouse.ty = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.tx = -9999
      mouse.ty = -9999
    }

    resize()
    if (reduced) draw()
    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
    io.observe(canvas)
    const section = canvas.parentElement!
    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 size-full [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
    />
  )
}
