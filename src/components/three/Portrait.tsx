import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { pointer } from '@/lib/pointer'

/**
 * A point-cloud portrait baked from a photo (see public/portrait/points.bin).
 * File layout: [u32 count][i16 x,y,z × n][u8 luminance × n][i8 normal x,y × n].
 * Positions are normalised to -1..1 (z: 0 = far, 1 = near).
 */
async function loadPortrait(url: string) {
  const buf = await (await fetch(url)).arrayBuffer()
  const count = new Uint32Array(buf, 0, 1)[0]
  let o = 4
  const pos = new Int16Array(buf, o, count * 3)
  o += count * 6
  const lum = new Uint8Array(buf, o, count)
  o += count
  const nrm = new Int8Array(buf.slice(o, o + count * 2))
  return { count, pos, lum, nrm }
}

const vertex = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uPixelRatio;
uniform float uSize;
uniform vec3 uMouse;
uniform float uMouseStrength;
attribute vec3 aPos;
attribute float aLum;
attribute vec2 aNormal;
attribute float aSeed;
attribute vec3 aScatter;
varying float vLum;
varying float vRim;
varying float vKey;
varying float vScan;
varying float vAlpha;

void main(){
  vec3 p = vec3(aPos.x * 1.6, aPos.y * 1.6, (aPos.z - 0.55) * 1.15);

  // Gentle "breathing" shimmer across the surface
  p.z += sin(uTime * 1.3 + p.y * 7.0 + aSeed * 6.2831) * 0.006;
  p.xy += vec2(sin(uTime * 0.7 + aSeed * 40.0), cos(uTime * 0.6 + aSeed * 31.0)) * 0.0035;

  // Dots part around the cursor and drift back
  vec2 d = p.xy - uMouse.xy;
  float dist = length(d);
  float push = smoothstep(0.35, 0.0, dist) * uMouseStrength;
  p.xy += normalize(d + 1e-4) * push * 0.08;

  // Intro: dots fly in from a scattered cloud and assemble, staggered per dot
  float t = clamp((uIntro * 1.6 - aSeed * 0.6), 0.0, 1.0);
  t = 1.0 - pow(1.0 - t, 3.0);
  p = mix(aScatter, p, t);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  vec3 n = normalize(vec3(aNormal, sqrt(max(0.0, 1.0 - dot(aNormal, aNormal)))));
  vLum = aLum;
  vKey = max(dot(n, normalize(vec3(-0.75, 0.35, 0.65))), 0.0);
  vRim = smoothstep(0.35, 0.95, dot(n, normalize(vec3(1.0, 0.15, 0.25)))) + smoothstep(0.15, 0.9, aPos.x) * 0.35;

  // A slow band of light that sweeps up through the portrait
  float scanY = mod(uTime * 0.28, 3.4) - 1.7;
  vScan = smoothstep(0.08, 0.0, abs(aPos.y * 1.6 - scanY));

  // Shoulders fade out toward the bottom edge
  vAlpha = smoothstep(-1.0, -0.15, aPos.y * 1.6) * mix(0.25, 1.0, t);

  float size = uSize * (0.55 + aLum * 0.9) * (1.0 + push * 1.5 + vScan * 0.6);
  gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);
}
`

const fragment = /* glsl */ `
uniform vec3 uShadow;
uniform vec3 uKey;
uniform vec3 uRim;
uniform vec3 uScanColor;
varying float vLum;
varying float vRim;
varying float vKey;
varying float vScan;
varying float vAlpha;

void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, d);

  // Dark base, bright highlights: lets the facial features carry the image
  float light = clamp(pow(vLum, 1.35) * 0.85 + vKey * 0.35, 0.0, 1.0);
  vec3 col = mix(uShadow, uKey, light);
  col += uRim * vRim * (0.25 + vLum * 0.9);
  col += uScanColor * vScan * 0.25;
  col *= 0.35 + light * 0.95;

  gl_FragColor = vec4(col, a * vAlpha * (0.45 + vLum * 0.55));
}
`

interface PortraitProps {
  quality: 'high' | 'low'
  timeScale: number
  skipIntro?: boolean
}

export function Portrait({ quality, timeScale, skipIntro = false }: PortraitProps) {
  const points = useRef<THREE.Points>(null!)
  const { gl, camera } = useThree()
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const introStart = useRef<number | null>(null)

  // The material is created here (not via JSX props) so per-frame uniform updates always reach the GPU
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uIntro: { value: skipIntro ? 1 : 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uSize: { value: quality === 'high' ? 2.0 : 2.1 },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uMouseStrength: { value: 0 },
          uShadow: { value: new THREE.Color('#0b1a6b') },
          uKey: { value: new THREE.Color('#5b8cff') },
          uRim: { value: new THREE.Color('#ff2e7e') },
          uScanColor: { value: new THREE.Color('#22d3ee') },
        },
      }),
    [gl, quality, skipIntro],
  )
  const uniforms = material.uniforms
  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    let cancelled = false
    loadPortrait('/portrait/points.bin').then(({ count, pos, lum, nrm }) => {
      if (cancelled) return
      // Fewer dots on phones and low-power devices (the file is pre-shuffled)
      const n = quality === 'high' ? Math.floor(count * 0.8) : Math.floor(count * 0.6)
      const g = new THREE.BufferGeometry()
      g.setAttribute('aPos', new THREE.BufferAttribute(pos.subarray(0, n * 3), 3, true))
      // Positions are decoded in the vertex shader; `position` only drives draw count and bounds
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
      g.setAttribute('aLum', new THREE.BufferAttribute(lum.subarray(0, n), 1, true))
      g.setAttribute('aNormal', new THREE.BufferAttribute(nrm.subarray(0, n * 2), 2, true))
      const seeds = new Float32Array(n)
      const scatter = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        seeds[i] = Math.random()
        const r = 2.5 + Math.random() * 4
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        scatter[i * 3] = r * Math.sin(ph) * Math.cos(th)
        scatter[i * 3 + 1] = r * Math.cos(ph)
        scatter[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 0.5
      }
      g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
      g.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8)
      setGeometry(g)
    })
    return () => {
      cancelled = true
    }
  }, [quality])

  useEffect(() => () => geometry?.dispose(), [geometry])

  // Reusable objects for projecting the cursor onto the portrait's plane
  const helpers = useMemo(
    () => ({ ray: new THREE.Raycaster(), plane: new THREE.Plane(), hit: new THREE.Vector3(), ndc: new THREE.Vector2(), normal: new THREE.Vector3() }),
    [],
  )

  useFrame((_, dt) => {
    if (!geometry) return
    const delta = Math.min(dt, 0.05)
    uniforms.uTime.value += delta * timeScale
    // Wall-clock based so the assemble animation takes the same time on slow devices
    if (uniforms.uIntro.value < 1) {
      introStart.current ??= performance.now()
      uniforms.uIntro.value = Math.min(1, (performance.now() - introStart.current) / 2600)
    }

    // Cursor position in the portrait's local space
    const obj = points.current
    obj.updateWorldMatrix(true, false)
    helpers.normal.set(0, 0, 1).transformDirection(obj.matrixWorld)
    helpers.plane.setFromNormalAndCoplanarPoint(helpers.normal, obj.getWorldPosition(helpers.hit))
    helpers.ndc.set(pointer.x, pointer.y)
    helpers.ray.setFromCamera(helpers.ndc, camera)
    const m = uniforms.uMouse.value
    if (helpers.ray.ray.intersectPlane(helpers.plane, helpers.hit)) {
      obj.worldToLocal(helpers.hit)
      m.x += (helpers.hit.x - m.x) * 0.18
      m.y += (helpers.hit.y - m.y) * 0.18
    }
    // Stronger reaction while the mouse is moving, settling when it rests
    const target = Math.min(1, 0.2 + pointer.speed * 1.2)
    uniforms.uMouseStrength.value += (target - uniforms.uMouseStrength.value) * 0.08
  })

  if (!geometry) return null
  return (
    <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
  )
}
