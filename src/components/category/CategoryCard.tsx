import { useState } from 'react'
import type { NormalizedCard } from '../../types/archidekt'
import { getCardImageUrl } from '../../services/scryfallImages'
import CardZoomModal from '../CardZoomModal'

interface CategoryCardProps {
  card: NormalizedCard
  isFocused: boolean
  isDisabled?: boolean
  onClick: () => void
}

export default function CategoryCard({
  card,
  isFocused,
  isDisabled,
  onClick,
}: CategoryCardProps) {
  const [showZoom, setShowZoom] = useState(false)

  return (
    <>
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`group relative flex-shrink-0 w-24 overflow-hidden transition-all duration-150 bg-[var(--surface-primary)] border
          ${isFocused
            ? 'border-2 border-[var(--lumon-green)] scale-105'
            : 'border-[var(--grid-line)]'
          }
          ${isDisabled
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:border-[var(--lumon-black)] cursor-pointer'
          }
        `}
      >
        <div className="relative">
          <img
            src={getCardImageUrl(card.scryfallId, 'small')}
            alt={card.name}
            className="w-full h-auto"
            draggable={false}
          />
          {/* Zoom icon overlay */}
          {!isDisabled && (
            <div
              className="absolute top-1 right-1 w-6 h-6 bg-[var(--lumon-black)]/70 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-zoom-in"
              onClick={(e) => {
                e.stopPropagation()
                setShowZoom(true)
              }}
            >
              <svg className="w-3.5 h-3.5 text-[var(--lumon-white)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          )}
        </div>
        <p className="font-mono text-[10px] text-center text-[var(--lumon-black)] truncate px-1.5 py-1.5 bg-[var(--surface-primary)] border-t border-[var(--grid-line)]">
          {card.name}
        </p>
      </button>

      {showZoom && (
        <CardZoomModal
          scryfallId={card.scryfallId}
          cardName={card.name}
          onClose={() => setShowZoom(false)}
        />
      )}
    </>
  )
}
