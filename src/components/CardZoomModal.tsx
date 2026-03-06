import { useEffect, useCallback, useState } from 'react'
import { getCardImageUrl } from '../services/scryfallImages'

interface CardZoomModalProps {
  scryfallId: string
  cardName: string
  onClose: () => void
}

export default function CardZoomModal({ scryfallId, cardName, onClose }: CardZoomModalProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter transition on next frame
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
    // Wait for exit transition before unmounting
    setTimeout(onClose, 200)
  }, [onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-[rgba(8,15,13,0.85)] backdrop-blur-sm transition-opacity duration-200
          ${visible ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Close button */}
      <button
        onClick={handleClose}
        className={`absolute top-4 right-4 z-10 w-10 h-10 border-2 border-[var(--lumon-white)] flex items-center justify-center
                   text-[var(--lumon-white)] hover:bg-[var(--lumon-white)] hover:text-[var(--lumon-black)]
                   transition-all duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Card image */}
      <img
        src={getCardImageUrl(scryfallId, 'large')}
        alt={cardName}
        className={`relative max-h-[90vh] max-w-[90vw] object-contain card-shadow-lg transition-all duration-200
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        draggable={false}
      />
    </div>
  )
}
