import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { particleShape, type ParticleShape } from '@/lib/particleShape'

/**
 * Full-page particle cloud behind the site.
 *
 * On load the points fly in from deep space and assemble, then slowly rotate.
 * Each section picks a shape (see useParticleShape) and the cloud flows into it:
 * ring, helix, sphere, galaxy, the "M" monogram or orbit rings. Particles near
 * the cursor are pushed away and drift back. Rendering pauses while the tab is hidden.
 */

const isMobile = () => window.innerWidth <= 990 || window.matchMedia('(pointer: coarse)').matches

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

function scatterShape(n: number) {
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const r = 60 + Math.random() * 80
    const th = Math.random() * Math.PI * 2
    const ph = Math.acos(2 * Math.random() - 1)
    a[i * 3] = r * Math.sin(ph) * Math.cos(th)
    a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
    a[i * 3 + 2] = r * Math.cos(ph)
  }
  return a
}

/** A wavy ring: radius breathes with 5 lobes, depth ripples with 3. */
function ringShape(n: number) {
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 * 7
    const r = 7 + Math.sin(t * 0.7) * 1.2 + (Math.random() - 0.5) * 1.8
    a[i * 3] = Math.cos(t) * r
    a[i * 3 + 1] = Math.sin(t) * r
    a[i * 3 + 2] = Math.cos(t * 3) * 1.6 + (Math.random() - 0.5) * 0.6
  }
  return a
}

/** Evenly spaced Fibonacci sphere. */
function sphereShape(n: number) {
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const ph = Math.acos(-1 + (2 * i) / n)
    const th = Math.sqrt(n * Math.PI) * ph
    a[i * 3] = 7 * Math.cos(th) * Math.sin(ph)
    a[i * 3 + 1] = 7 * Math.sin(th) * Math.sin(ph)
    a[i * 3 + 2] = 7 * Math.cos(ph)
  }
  return a
}

/** Samples the "M" monogram (same path as the nav logo) from an offscreen canvas. */
function monogramShape(n: number) {
  const size = 200
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.scale(size / 64, size / 64)
  ctx.lineWidth = 9
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#fff'
  ctx.stroke(new Path2D('M10 50V14l22 22 22-22v36'))
  const data = ctx.getImageData(0, 0, size, size).data
  const pts: number[] = []
  for (let y = 0; y < size; y += 2)
    for (let x = 0; x < size; x += 2) if (data[(y * size + x) * 4 + 3] > 128) pts.push(x, y)
  const count = pts.length / 2
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const k = (i % count) * 2
    a[i * 3] = (pts[k] / size - 0.5) * 13 + (Math.random() - 0.5) * 0.15
    a[i * 3 + 1] = -(pts[k + 1] / size - 0.5) * 13 + (Math.random() - 0.5) * 0.15
    a[i * 3 + 2] = (Math.random() - 0.5) * 1.2
  }
  return a
}

/** A glowing core with tilted orbit rings around it. */
function orbitShape(n: number) {
  const radii = [10, 14, 19, 25]
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    if (i < n * 0.15) {
      const r = Math.cbrt(Math.random()) * 2.6
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      a[i * 3] = r * Math.sin(ph) * Math.cos(th)
      a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      a[i * 3 + 2] = r * Math.cos(ph)
    } else {
      const r = radii[i % radii.length]
      const th = Math.random() * Math.PI * 2
      a[i * 3] = r * Math.cos(th) + (Math.random() - 0.5) * 0.8
      a[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      a[i * 3 + 2] = r * 0.9 * Math.sin(th) + (Math.random() - 0.5) * 0.8
    }
  }
  return a
}

/** A tilted spiral galaxy that spreads wide across the screen. */
function galaxyShape(n: number) {
  const arms = 3
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const r = 1.5 + Math.pow(Math.random(), 0.65) * 30
    const arm = (i % arms) * ((Math.PI * 2) / arms)
    const th = arm + r * 0.32 + (Math.random() - 0.5) * (0.9 + r * 0.02)
    a[i * 3] = Math.cos(th) * r
    a[i * 3 + 1] = (Math.random() - 0.5) * (2.2 - r * 0.05)
    a[i * 3 + 2] = Math.sin(th) * r
  }
  return a
}

/** A double helix lying across the screen, with rungs between the strands. */
function helixShape(n: number) {
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const t = (Math.random() - 0.5) * 30
    const ph = t * 0.55
    if (i % 6 === 0) {
      // rung: a point somewhere between the two strands
      const k = Math.random() * 2 - 1
      a[i * 3] = t
      a[i * 3 + 1] = Math.cos(ph) * 3.6 * k
      a[i * 3 + 2] = Math.sin(ph) * 3.6 * k
    } else {
      const strand = i % 2 ? Math.PI : 0
      a[i * 3] = t + (Math.random() - 0.5) * 0.3
      a[i * 3 + 1] = Math.cos(ph + strand) * 3.6 + (Math.random() - 0.5) * 0.5
      a[i * 3 + 2] = Math.sin(ph + strand) * 3.6 + (Math.random() - 0.5) * 0.5
    }
  }
  return a
}

/** How far each shape leans toward the viewer (rotation about x). */
const tilt: Record<ParticleShape, number> = {
  ring: 0,
  helix: 0.25,
  sphere: 0.4,
  galaxy: 1.05,
  monogram: 0,
  orbit: 0.35,
}

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const ctx = c.getContext('2d')!
  ctx.beginPath()
  ctx.arc(16, 16, 14, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  return new THREE.CanvasTexture(c)
}

export default function ParticleField() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current!
    const mobile = isMobile()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    const N = mobile ? 3500 : 7000
    const cfg = {
      size: mobile ? 0.11 : 0.09,
      mouseRadius: 1.2,
      mouseForce: 0.6,
      returnSpeed: 0.05,
      rotSpeed: 0.002,
      assembleMs: reduced ? 0 : mobile ? 1600 : 2800,
    }

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' })
    } catch {
      return // No WebGL: the CSS orbs still give the page depth
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.5s ease'
    el.appendChild(renderer.domElement)
    requestAnimationFrame(() => (renderer.domElement.style.opacity = '1'))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 25

    const scatter = scatterShape(N)
    const shapes: Record<ParticleShape, Float32Array> = {
      ring: ringShape(N),
      helix: helixShape(N),
      sphere: sphereShape(N),
      galaxy: galaxyShape(N),
      monogram: monogramShape(N),
      orbit: orbitShape(N),
    }
    const assembling = new Float32Array(N * 3)
    let target: Float32Array = assembling
    const positions = scatter.slice()

    const colors = new Float32Array(N * 3)
    const c1 = new THREE.Color('#06b6d4')
    const c2 = new THREE.Color('#6366f1')
    const c = new THREE.Color()
    for (let i = 0; i < N; i++) {
      c.copy(c1).lerp(c2, i / N)
      if (Math.random() > 0.4) c.multiplyScalar(0.15)
      colors.set([c.r, c.g, c.b], i * 3)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const texture = dotTexture()
    const material = new THREE.PointsMaterial({
      size: cfg.size,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // --- state ---
    let lastA = NaN
    let lastShape: ParticleShape | null = null
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      const aspect = camera.aspect
      points.scale.setScalar(aspect >= 0.6 ? 1 : aspect / 0.6)
    }
    const mouse = new THREE.Vector2(-10, -10)
    const onMove = (e: PointerEvent) => mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)

    onResize()
    window.addEventListener('resize', onResize)
    if (fine && !reduced) window.addEventListener('pointermove', onMove)

    const raycaster = new THREE.Raycaster()
    const inv = new THREE.Matrix4()
    const ray = new THREE.Ray()
    const start = performance.now()
    let raf = 0
    let rotSpeed = 0

    const frame = () => {
      const now = performance.now()
      raf = requestAnimationFrame(frame)
      const tAssemble = cfg.assembleMs ? clamp01((now - start) / cfg.assembleMs) : 1
      const A = easeInOut(tAssemble)
      if (!reduced) rotSpeed = cfg.rotSpeed * clamp01((now - start - cfg.assembleMs + 1000) / 2500)

      // While assembling, blend from deep space into the current shape with a spiral;
      // afterwards the target is simply the active shape and particles ease toward it
      const shapeName = particleShape.get()
      if (A !== lastA || shapeName !== lastShape) {
        const shape = shapes[shapeName]
        if (A < 1) {
          const spin = (1 - A) * 8
          const cs = Math.cos(spin)
          const sn = Math.sin(spin)
          for (let i = 0; i < N * 3; i += 3) {
            const x = scatter[i] * (1 - A) + shape[i] * A
            const y = scatter[i + 1] * (1 - A) + shape[i + 1] * A
            const z = scatter[i + 2] * (1 - A) + shape[i + 2] * A
            assembling[i] = x * cs - z * sn
            assembling[i + 1] = y
            assembling[i + 2] = x * sn + z * cs
          }
          target = assembling
        } else {
          target = shape
        }
        lastA = A
        lastShape = shapeName
      }

      // Cursor ray in the cloud's local space, for the repel effect
      const interactive = fine && !reduced && A > 0.9 && mouse.x > -2
      if (interactive) {
        raycaster.setFromCamera(mouse, camera)
        inv.copy(points.matrixWorld).invert()
        ray.copy(raycaster.ray).applyMatrix4(inv)
      }
      const R2 = cfg.mouseRadius * cfg.mouseRadius
      const { x: ox, y: oy, z: oz } = ray.origin
      const { x: dx, y: dy, z: dz } = ray.direction

      for (let i = 0; i < N * 3; i += 3) {
        let px = positions[i]
        let py = positions[i + 1]
        let pz = positions[i + 2]
        let pushed = false
        if (interactive) {
          const t = (px - ox) * dx + (py - oy) * dy + (pz - oz) * dz
          const cx = ox + dx * Math.max(0, t)
          const cy = oy + dy * Math.max(0, t)
          const cz = oz + dz * Math.max(0, t)
          const ex = px - cx
          const ey = py - cy
          const ez = pz - cz
          const d2 = ex * ex + ey * ey + ez * ez
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 0.001
            const f = (cfg.mouseRadius - d) * cfg.mouseForce
            px += (ex / d) * f
            py += (ey / d) * f
            pz += (ez / d) * f
            pushed = true
          }
        }
        if (!pushed) {
          px += (target[i] - px) * (reduced ? 1 : cfg.returnSpeed)
          py += (target[i + 1] - py) * (reduced ? 1 : cfg.returnSpeed)
          pz += (target[i + 2] - pz) * (reduced ? 1 : cfg.returnSpeed)
        }
        positions[i] = px
        positions[i + 1] = py
        positions[i + 2] = pz
      }
      geometry.attributes.position.needsUpdate = true

      points.rotation.y += rotSpeed
      points.rotation.x += (tilt[shapeName] - points.rotation.x) * 0.04
      renderer.render(scene, camera)
    }

    const startLoop = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const stopLoop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onVisibility = () => (document.hidden ? stopLoop() : startLoop())
    document.addEventListener('visibilitychange', onVisibility)
    startLoop()

    return () => {
      stopLoop()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={host} aria-hidden className="pointer-events-none fixed inset-0" />
}
