import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { pointer, startPointerTracking } from '@/lib/pointer'
import { coreFragment, coreVertex, particlesFragment, particlesVertex } from './shaders'

const ELECTRIC = new THREE.Color('#3d7bff')
const VIOLET = new THREE.Color('#8b5cf6')
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

function Core({ detail, timeScale }: { detail: number; timeScale: number }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.32 },
      uMouse: { value: new THREE.Vector2() },
      uColorA: { value: new THREE.Color('#1b2a8f') },
      uColorB: { value: VIOLET.clone() },
      uColorC: { value: CYAN.clone() },
    }),
    [],
  )

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.05)
    uniforms.uTime.value += delta * timeScale
    const m = uniforms.uMouse.value
    m.x += (pointer.x - m.x) * 0.06
    m.y += (pointer.y - m.y) * 0.06
    // Moving the mouse quickly "excites" the core
    const target = 0.3 + pointer.speed * 0.32
    uniforms.uIntensity.value += (target - uniforms.uIntensity.value) * 0.05
    pointer.speed *= 0.94
    mesh.current.rotation.y += delta * 0.12 * timeScale
    mesh.current.rotation.x += delta * 0.05 * timeScale
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.25, detail]} />
      <shaderMaterial uniforms={uniforms} vertexShader={coreVertex} fragmentShader={coreFragment} />
    </mesh>
  )
}

function Shell({ glow, timeScale }: { glow: THREE.Texture; timeScale: number }) {
  const group = useRef<THREE.Group>(null!)
  const { edges, nodes } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.05, 1)
    const edges = new THREE.EdgesGeometry(geo)
    // Unique vertices become glowing nodes
    const pos = geo.getAttribute('position')
    const seen = new Set<string>()
    const pts: number[] = []
    for (let i = 0; i < pos.count; i++) {
      const k = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`
      if (seen.has(k)) continue
      seen.add(k)
      pts.push(pos.getX(i), pos.getY(i), pos.getZ(i))
    }
    const nodes = new THREE.BufferGeometry()
    nodes.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    geo.dispose()
    return { edges, nodes }
  }, [])

  useFrame((_, dt) => {
    group.current.rotation.y -= Math.min(dt, 0.05) * 0.06 * timeScale
    group.current.rotation.z += Math.min(dt, 0.05) * 0.02 * timeScale
  })

  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#7c8cff" transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
      <points geometry={nodes}>
        <pointsMaterial
          map={glow}
          color="#9fd8ff"
          size={0.16}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

function Orbit({
  radius,
  tilt,
  speed,
  color,
  glow,
  offset = 0,
  timeScale,
}: {
  radius: number
  tilt: [number, number, number]
  speed: number
  color: string
  glow: THREE.Texture
  offset?: number
  timeScale: number
}) {
  const sat = useRef<THREE.Group>(null!)
  const t = useRef(offset)
  useFrame((_, dt) => {
    t.current += Math.min(dt, 0.05) * speed * timeScale
    sat.current.position.set(Math.cos(t.current) * radius, 0, Math.sin(t.current) * radius)
  })
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.0045, 6, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <group ref={sat}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <sprite scale={0.6}>
          <spriteMaterial map={glow} color={color} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    </group>
  )
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

/** Moves the whole structure toward the cursor and frames it for the viewport size. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!)
  const { viewport, camera } = useThree()
  const wide = viewport.aspect > 1.15

  useFrame(() => {
    const g = group.current
    const targetX = wide ? Math.min(viewport.width * 0.3, 4.4) : 0
    const targetY = wide ? 0 : viewport.height * 0.28
    g.position.x += (targetX - g.position.x) * 0.08
    g.position.y += (targetY - g.position.y) * 0.08
    g.rotation.y += (pointer.x * 0.45 - g.rotation.y) * 0.04
    g.rotation.x += (-pointer.y * 0.3 - g.rotation.x) * 0.04
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.03
    camera.position.y += (pointer.y * 0.25 - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })

  const scale = wide ? 0.9 : Math.min(0.8, viewport.width / 6.8)
  return (
    <group ref={group} scale={scale}>
      {children}
    </group>
  )
}

function Scene({ quality, timeScale }: { quality: 'high' | 'low'; timeScale: number }) {
  const glow = useGlowTexture()
  return (
    <>
      <Rig>
        {/* Halo behind the core fakes bloom without a post-processing pass */}
        <sprite scale={7.5} position={[0, 0, -1.2]}>
          <spriteMaterial map={glow} color="#4f46e5" transparent opacity={0.42} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <Core detail={quality === 'high' ? 5 : 3} timeScale={timeScale} />
        <Shell glow={glow} timeScale={timeScale} />
        <Orbit radius={2.7} tilt={[0.35, 0, 0.25]} speed={0.45} color="#22d3ee" glow={glow} timeScale={timeScale} />
        <Orbit radius={3.15} tilt={[-0.5, 0.4, -0.15]} speed={-0.3} color="#8b5cf6" glow={glow} offset={2} timeScale={timeScale} />
        <Orbit radius={2.35} tilt={[1.15, -0.2, 0.6]} speed={0.6} color="#3d7bff" glow={glow} offset={4} timeScale={timeScale} />
      </Rig>
      <Particles count={quality === 'high' ? 1400 : 600} timeScale={timeScale} />
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
        <Scene quality={quality} timeScale={reduced ? 0.15 : 1} />
      </Canvas>
    </div>
  )
}
