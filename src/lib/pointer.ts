/**
 * A single, allocation-free global pointer store in normalised device
 * coordinates (-1..1). WebGL scenes read from it every frame, so they react to
 * the mouse even when HTML content is layered over the canvas.
 */
export const pointer = { x: 0, y: 0, speed: 0 }

let lastX = 0
let lastY = 0
let started = false

export function startPointerTracking() {
  if (started || typeof window === 'undefined') return
  started = true
  const onMove = (e: PointerEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -((e.clientY / window.innerHeight) * 2 - 1)
    pointer.speed = Math.min(1, pointer.speed + Math.hypot(x - lastX, y - lastY) * 2)
    pointer.x = x
    pointer.y = y
    lastX = x
    lastY = y
  }
  window.addEventListener('pointermove', onMove, { passive: true })
}
