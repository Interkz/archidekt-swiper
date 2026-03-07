import { useState, useRef, useCallback, useEffect } from 'react'
import type { NormalizedCard } from '../types/archidekt'
import { getCardImageUrl } from '../services/scryfallImages'
import CardDetails from './CardDetails'

interface SwipeCardProps {
  card: NormalizedCard
  onSwipe: (direction: string) => void
  onCardLeftScreen: () => void
}

const SWIPE_THRESHOLD = 50
const FLY_OUT_DISTANCE = 600
const FLY_OUT_MS = 300
const RUBBER_BAND_MS = 400

type SwipeDir = 'left' | 'right' | 'up' | null

/** Determine if the gesture exceeds threshold in a direction */
function getSwipeDirection(dx: number, dy: number): SwipeDir {
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (dy < -SWIPE_THRESHOLD && absDy > absDx) return 'up'
  if (dx > SWIPE_THRESHOLD && absDx >= absDy) return 'right'
  if (dx < -SWIPE_THRESHOLD && absDx >= absDy) return 'left'
  return null
}

/** Get the intended direction even before threshold (for visual hints) */
function getSwipeIntent(dx: number, dy: number): SwipeDir {
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (absDx < 5 && absDy < 5) return null
  if (dy < 0 && absDy > absDx) return 'up'
  if (dx > 0 && absDx >= absDy) return 'right'
  if (dx < 0 && absDx >= absDy) return 'left'
  return null
}

export default function SwipeCard({ card, onSwipe, onCardLeftScreen }: SwipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef<{ x: number; y: number } | null>(null)
  const [delta, setDelta] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [animState, setAnimState] = useState<'idle' | 'rubber-band' | 'fly-out'>('idle')
  const [flyTarget, setFlyTarget] = useState({ x: 0, y: 0 })

  // Refs to avoid stale closures in global event listeners
  const deltaRef = useRef(delta)
  deltaRef.current = delta
  const animStateRef = useRef(animState)
  animStateRef.current = animState

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (animStateRef.current === 'fly-out') return
    startPos.current = { x: clientX, y: clientY }
    setIsDragging(true)
    setAnimState('idle')
    setDelta({ x: 0, y: 0 })
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!startPos.current || animStateRef.current === 'fly-out') return
    const dx = clientX - startPos.current.x
    const dy = clientY - startPos.current.y
    // Block downward movement
    setDelta({ x: dx, y: Math.min(dy, 0) })
  }, [])

  const handleEnd = useCallback(() => {
    if (!startPos.current || animStateRef.current === 'fly-out') {
      startPos.current = null
      setIsDragging(false)
      return
    }

    const d = deltaRef.current
    const direction = getSwipeDirection(d.x, d.y)

    if (direction) {
      setAnimState('fly-out')
      let tx = 0, ty = 0
      if (direction === 'right') tx = FLY_OUT_DISTANCE
      else if (direction === 'left') tx = -FLY_OUT_DISTANCE
      else if (direction === 'up') ty = -FLY_OUT_DISTANCE
      setFlyTarget({ x: tx, y: ty })

      setTimeout(() => {
        onSwipe(direction)
        onCardLeftScreen()
      }, FLY_OUT_MS)
    } else {
      // Rubber-band snap back
      setAnimState('rubber-band')
      setDelta({ x: 0, y: 0 })
      setTimeout(() => setAnimState('idle'), RUBBER_BAND_MS)
    }

    startPos.current = null
    setIsDragging(false)
  }, [onSwipe, onCardLeftScreen])

  // Touch events — attach touchmove with { passive: false } to allow preventDefault
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      handleStart(t.clientX, t.clientY)
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault() // prevent scroll while swiping
      const t = e.touches[0]
      handleMove(t.clientX, t.clientY)
    }

    const onTouchEnd = () => {
      handleEnd()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleStart, handleMove, handleEnd])

  // Mouse drag: attach global mousemove/mouseup while dragging
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onMouseUp = () => handleEnd()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, handleMove, handleEnd])

  // Visual state
  const intent = isDragging ? getSwipeIntent(delta.x, delta.y) : null
  const maxDist = Math.max(Math.abs(delta.x), Math.abs(delta.y))
  const intensity = Math.min(1, maxDist / (SWIPE_THRESHOLD * 2))
  const pastThreshold = maxDist >= SWIPE_THRESHOLD

  // Transform
  const tx = animState === 'fly-out' ? flyTarget.x : delta.x
  const ty = animState === 'fly-out' ? flyTarget.y : delta.y
  const rotation = tx * 0.05

  // Transition
  let transition = 'none'
  if (animState === 'rubber-band') {
    transition = `transform ${RUBBER_BAND_MS}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`
  }
  if (animState === 'fly-out') {
    transition = `transform ${FLY_OUT_MS}ms ease-out, opacity ${FLY_OUT_MS}ms ease-out`
  }

  // Overlay color
  let overlayBg = 'transparent'
  if (intent === 'right') overlayBg = `rgba(31, 66, 52, ${intensity * 0.25})`
  if (intent === 'left') overlayBg = `rgba(8, 15, 13, ${intensity * 0.2})`
  if (intent === 'up') overlayBg = `rgba(139, 90, 43, ${intensity * 0.2})`

  return (
    <div
      ref={cardRef}
      className="absolute w-full"
      style={{
        transform: `translate(${tx}px, ${ty}px) rotate(${rotation}deg)`,
        transition,
        opacity: animState === 'fly-out' ? 0 : 1,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onMouseDown={onMouseDown}
    >
      <div className="relative preserve-3d">
        {/* ACCEPTED stamp - clinical approval */}
        <div
          className={`absolute top-8 left-4 z-30 stamp stamp-accepted
                      ${intent === 'right' && pastThreshold ? 'stamp-visible' : ''}`}
        >
          <span className="text-sm tracking-widest">ACCEPTED</span>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-[var(--lumon-green)]" />
            ))}
          </div>
        </div>

        {/* REJECTED stamp - clinical rejection */}
        <div
          className={`absolute top-8 right-4 z-30 stamp stamp-rejected
                      ${intent === 'left' && pastThreshold ? 'stamp-visible' : ''}`}
        >
          <span className="text-sm tracking-widest">REJECTED</span>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 border border-[var(--lumon-black)] bg-transparent" />
            ))}
          </div>
        </div>

        {/* DEFERRED stamp - clinical deferral */}
        <div
          className={`absolute top-8 left-1/2 -translate-x-1/2 z-30 stamp stamp-deferred
                      ${intent === 'up' && pastThreshold ? 'stamp-visible' : ''}`}
        >
          <span className="text-sm tracking-widest">DEFERRED</span>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 border border-[#8b5a2b] bg-transparent" />
            ))}
          </div>
        </div>

        {/* Card image with physical presence */}
        <div className="relative bg-surface overflow-hidden card-shadow-lg transition-shadow duration-200 hover:card-shadow-hover">
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-30"
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                 mixBlendMode: 'multiply'
               }}
          />

          {/* Card border - thin black line */}
          <div className="absolute inset-0 border border-[var(--lumon-black)]/10 pointer-events-none z-10" />

          {/* Swipe direction color tint overlay */}
          {intent && (
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ backgroundColor: overlayBg }}
            />
          )}

          {/* Directional arrow indicator */}
          {intent && intensity > 0.1 && (
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              <div
                className="p-4 rounded-full"
                style={{
                  opacity: intensity,
                  backgroundColor: intent === 'right'
                    ? 'rgba(31, 66, 52, 0.15)'
                    : intent === 'left'
                      ? 'rgba(8, 15, 13, 0.1)'
                      : 'rgba(139, 90, 43, 0.15)',
                  transform: `scale(${0.8 + intensity * 0.4})`,
                  transition: 'transform 100ms ease-out',
                }}
              >
                {intent === 'right' && (
                  <svg className="w-12 h-12 text-[var(--lumon-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
                {intent === 'left' && (
                  <svg className="w-12 h-12 text-[var(--lumon-black)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                )}
                {intent === 'up' && (
                  <svg className="w-12 h-12 text-[#8b5a2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Loading state - clinical placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-lumon-cream">
              <div className="w-12 h-12 border-2 border-[var(--lumon-black)] border-t-transparent animate-spin" />
              <span className="mt-4 text-terminal text-[var(--status-neutral)]">Loading</span>
            </div>
          )}

          <img
            src={getCardImageUrl(card.scryfallId, 'normal')}
            alt={card.name}
            className={`w-full h-auto transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            draggable={false}
          />
        </div>

        {/* Card details */}
        <CardDetails card={card} />
      </div>
    </div>
  )
}
