import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { pointer, startPointerTracking } from '@/lib/pointer'
import { Portrait } from './Portrait'
import { particlesFragment, particlesVertex } from './shaders'

const ELECTRIC = new THREE.Color('#3d7bff')
const CYAN = new THREE.Color('#22d3ee')

/** Soft radial sprite used for glows — generated once, no image download. */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.25, 'rgba(255,255,255,0.45)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function Particles({ count, timeScale }: { count: number; timeScale: number }) {
  const ref = useRef<THREE.Points>(null!)
  const { gl } = useThree()
  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Distribute in a thick spherical shell around the core
      const r = 2.8 + Math.pow(Math.random(), 0.7) * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.7, r * Math.sin(phi) * Math.sin(theta)], i * 3)
      scales[i] = 0.4 + Math.random() * 1.4
      seeds[i] = Math.random()
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    const uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColorA: { value: ELECTRIC.clone().lerp(new THREE.Color('#ffffff'), 0.35) },
      uColorB: { value: CYAN.clone() },
    }
    return { geometry, uniforms }
  }, [count, gl])

  useFrame((_, dt) => {
    uniforms.uTime.value += Math.min(dt, 0.05) * timeScale
    ref.current.rotation.y += Math.min(dt, 0.05) * 0.015 * timeScale
  })

  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Layout anchors measured from the hero's HTML, in canvas pixels. */
export interface HeroAnchors {
  canvasH: number
  canvasW: number
  /** Vertical centre and height of the name heading */
  nameCenterY: number
  nameHeight: number
  /** Right edge of the longest name line */
  nameRight: number
  /** Top of the status pill (the first line of hero text) */
  badgeTop: number
  /** Bottom of the fixed navigation bar */
  navBottom: number
}

// Portrait-local measurements (the bust spans roughly -1..1 vertically)
const HEAD_CENTER = 0.3
const HEAD_HEIGHT = 1.4
const BUST_HALF_WIDTH = 1.0
const VISIBLE_BOTTOM = -0.75

/**
 * Turns the portrait toward the cursor and places it relative to the hero text:
 * level with the name on wide screens, above the text on narrow ones.
 */
function Rig({ children, anchors }: { children: React.ReactNode; anchors: React.RefObject<HeroAnchors | null> }) {
  const group = useRef<THREE.Group>(null!)
  const { viewport, camera, size } = useThree()

  useFrame(({ clock }) => {
    const g = group.current
    const t = clock.getElapsedTime()
    const a = anchors.current
    // Matches the hero's `lg:landscape:` layout
    const wide = size.width >= 1024 && size.width > size.height
    const unit = viewport.height / size.height // world units per CSS pixel
    const toWorldY = (px: number) => (size.height / 2 - px) * unit
    const toWorldX = (px: number) => (px - size.width / 2) * unit

    let targetX = 0
    let targetY = 0
    let targetScale = 1
    if (a && wide) {
      // Face sized to the name block and centred in the free space to its right
      const free = viewport.width / 2 - toWorldX(a.nameRight)
      targetScale = Math.min((a.nameHeight * unit * 1.25) / HEAD_HEIGHT, (free - 0.3) / (BUST_HALF_WIDTH * 2))
      targetScale = Math.max(0.7, targetScale)
      targetX = toWorldX(a.nameRight) + free / 2
      targetY = toWorldY(a.nameCenterY) - HEAD_CENTER * targetScale
    } else if (a) {
      // Fit the bust into the space between the nav bar and the first line of text
      const top = a.navBottom + 8
      const bottom = a.badgeTop - 8
      const regionH = Math.max(40, bottom - top) * unit
      targetScale = Math.min(regionH / (1 - VISIBLE_BOTTOM), (viewport.width * 0.9) / (BUST_HALF_WIDTH * 2))
      targetY = toWorldY(top) - 1 * targetScale
    }
    const first = g.userData.placed !== true
    const k = first ? 1 : 0.1
    g.position.x += (targetX - g.position.x) * k
    g.position.y += (targetY - g.position.y) * k
    g.scale.setScalar(g.scale.x + (targetScale - g.scale.x) * k)
    if (a) g.userData.placed = true

    // Head only turns slightly: a single photo has no detail for the hidden side, so larger turns distort the face
    const MAX_YAW = 0.12
    const MAX_PITCH = 0.05
    const yaw = THREE.MathUtils.clamp(pointer.x * MAX_YAW + Math.sin(t * 0.35) * 0.025, -MAX_YAW, MAX_YAW)
    const pitch = THREE.MathUtils.clamp(-pointer.y * MAX_PITCH + Math.sin(t * 0.27) * 0.012, -MAX_PITCH, MAX_PITCH)
    g.rotation.y += (yaw - g.rotation.y) * 0.04
    g.rotation.x += (pitch - g.rotation.x) * 0.04
    // Subtle camera parallax, kept small so the portrait stays aligned with the text
    camera.position.x += (pointer.x * 0.06 - camera.position.x) * 0.03
    camera.position.y += (pointer.y * 0.04 - camera.position.y) * 0.03
    camera.lookAt(camera.position.x, camera.position.y, 0)
    pointer.speed *= 0.94
  })

  return <group ref={group}>{children}</group>
}

function Scene({
  quality,
  timeScale,
  reduced,
  anchors,
}: {
  quality: 'high' | 'low'
  timeScale: number
  reduced: boolean
  anchors: React.RefObject<HeroAnchors | null>
}) {
  const glow = useGlowTexture()
  return (
    <>
      <Rig anchors={anchors}>
        {/* Soft blue and magenta halos behind the head fake bloom without post-processing */}
        <sprite scale={5.5} position={[-0.5, 0.3, -1.4]}>
          <spriteMaterial map={glow} color="#3b4fe0" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <sprite scale={4.2} position={[1.1, 0.1, -1.6]}>
          <spriteMaterial map={glow} color="#c0266d" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <Portrait quality={quality} timeScale={timeScale} skipIntro={reduced} />
      </Rig>
      <Particles count={quality === 'high' ? 1200 : 500} timeScale={timeScale} />
    </>
  )
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const quality = useMemo<'high' | 'low'>(() => {
    const cores = navigator.hardwareConcurrency ?? 4
    return window.innerWidth < 768 || cores <= 4 ? 'low' : 'high'
  }, [])
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // Measure where the hero text sits so the portrait can line up with it
  const anchors = useRef<HeroAnchors | null>(null)
  useEffect(() => {
    const section = wrapper.current?.closest('section')
    if (!section) return
    // offsetTop ignores the scroll-linked transforms on the hero content
    const layoutTop = (el: HTMLElement) => {
      let y = 0
      let n: HTMLElement | null = el
      while (n && n !== section) {
        y += n.offsetTop
        n = n.offsetParent as HTMLElement | null
      }
      return y
    }
    const measure = () => {
      const name = section.querySelector<HTMLElement>('#hero-name')
      const badge = section.querySelector<HTMLElement>('#hero-badge')
      const nav = document.querySelector<HTMLElement>('header nav')
      if (!name || !badge) return
      const sRect = section.getBoundingClientRect()
      const words = name.querySelectorAll<HTMLElement>('[data-name-line]')
      let right = 0
      words.forEach((w) => (right = Math.max(right, w.getBoundingClientRect().right - sRect.left)))
      const top = layoutTop(name)
      anchors.current = {
        canvasW: section.clientWidth,
        canvasH: section.clientHeight,
        nameCenterY: top + name.offsetHeight / 2,
        nameHeight: name.offsetHeight,
        nameRight: right || sRect.width / 2,
        badgeTop: layoutTop(badge),
        // The header is fixed with 16px top padding; measured from layout so a hidden nav doesn't skew it
        navBottom: nav ? 16 + nav.offsetHeight : 72,
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(section)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    startPointerTracking()
    // Stop rendering entirely when the hero is off-screen
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    if (wrapper.current) io.observe(wrapper.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapper} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, quality === 'high' ? 1.75 : 1.25]}
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => onReady?.()}
      >
        <Scene quality={quality} timeScale={reduced ? 0.15 : 1} reduced={reduced} anchors={anchors} />
      </Canvas>
    </div>
  )
}
