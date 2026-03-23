import { useCallback, useRef } from 'react'

/**
 * Balatro-style 3D card tilt + holographic shimmer effect.
 * Apply the returned ref to any card container, and add CSS classes
 * `card-tilt` and `card-shimmer` to the element.
 *
 * The hook sets CSS custom properties --mx, --my, --angle on the element
 * which the CSS classes use for the 3D transform and shimmer gradient.
 */
export function useCardTilt<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2   // -1 to 1
    const my = -((e.clientY - rect.top) / rect.height - 0.5) * 2  // -1 to 1
    const angle = Math.atan2(my, mx) * (180 / Math.PI) + 135

    el.style.setProperty('--mx', mx.toFixed(3))
    el.style.setProperty('--my', my.toFixed(3))
    el.style.setProperty('--angle', angle.toFixed(1))
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return

    // Reset to neutral position
    el.style.setProperty('--mx', '0')
    el.style.setProperty('--my', '0')
    el.style.setProperty('--angle', '135')
  }, [])

  return {
    ref,
    tiltProps: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  }
}
