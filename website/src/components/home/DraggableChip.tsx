import { useRef, useState, type ReactNode, type RefObject } from 'react'

/**
 * A floating chip you can grab and move with mouse or finger (pointer events).
 * It stays inside `boundsRef`. The outer element moves; the inner one keeps
 * the gentle float animation, so the two transforms don't fight.
 */
export default function DraggableChip({
  boundsRef,
  className,
  floatDelay = '0s',
  zIndex,
  onGrab,
  children,
}: {
  boundsRef: RefObject<HTMLElement | null>
  /** Initial absolute position, e.g. "top-[20%] right-0" */
  className: string
  floatDelay?: string
  zIndex: number
  onGrab: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const start = useRef({ px: 0, py: 0, ox: 0, oy: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 })

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    const bounds = boundsRef.current
    if (!el || !bounds) return
    onGrab()
    el.setPointerCapture(e.pointerId)
    const b = bounds.getBoundingClientRect()
    const c = el.getBoundingClientRect()
    // How far the chip can still move in each direction from where it is now
    start.current = {
      px: e.clientX,
      py: e.clientY,
      ox: offset.x,
      oy: offset.y,
      minX: offset.x - (c.left - b.left),
      maxX: offset.x + (b.right - c.right),
      minY: offset.y - (c.top - b.top),
      maxY: offset.y + (b.bottom - c.bottom),
    }
    setDragging(true)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    const s = start.current
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    setOffset({
      x: clamp(s.ox + e.clientX - s.px, s.minX, s.maxX),
      y: clamp(s.oy + e.clientY - s.py, s.minY, s.maxY),
    })
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    ref.current?.releasePointerCapture(e.pointerId)
    setDragging(false)
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, zIndex, touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className={`rounded-2xl shadow-lift transition-transform duration-200 ${dragging ? 'scale-105 rotate-[-2deg]' : 'animate-float'}`}
        style={{ animationDelay: floatDelay }}
      >
        {children}
      </div>
    </div>
  )
}
