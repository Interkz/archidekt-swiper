import { useEffect } from 'react'
import type { NormalizedCard } from '../types/archidekt'
import { getCardImageUrl } from '../services/scryfallImages'

interface CardDetailsOverlayProps {
  card: NormalizedCard
  onClose: () => void
}

function formatManaCost(manaCost: string): string {
  return manaCost.replace(/\{([^}]+)\}/g, '[$1]')
}

function formatOracleText(text: string): string {
  return text.replace(/\{([^}]+)\}/g, '[$1]')
}

export default function CardDetailsOverlay({ card, onClose }: CardDetailsOverlayProps) {
  // Close on backdrop click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('modal-backdrop')) {
        onClose()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [onClose])

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--lumon-white)] border-2 border-[var(--lumon-black)] max-w-lg w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[var(--lumon-black)] px-4 py-3">
          <span className="text-terminal text-[var(--status-neutral)]">CARD DETAILS</span>
          <button
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-wider text-[var(--status-neutral)]
                       hover:text-[var(--lumon-black)] transition-colors px-2 py-1 border border-[var(--grid-line)]
                       hover:border-[var(--lumon-black)]"
          >
            ESC
          </button>
        </div>

        <div className="p-4 flex flex-col sm:flex-row gap-4">
          {/* Card image */}
          <div className="flex-shrink-0 w-full sm:w-48">
            <img
              src={getCardImageUrl(card.scryfallId, 'normal')}
              alt={card.name}
              className="w-full h-auto border border-[var(--grid-line)]"
              draggable={false}
            />
          </div>

          {/* Card info */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <h2 className="font-display text-lg font-bold tracking-tight text-[var(--lumon-black)]">
              {card.name}
            </h2>

            {/* Mana cost */}
            {card.manaCost && (
              <div className="mt-2">
                <span className="font-mono text-sm text-[var(--lumon-green)] bg-[var(--lumon-green-pale)] px-2 py-0.5 border border-[var(--lumon-green)]/20">
                  {formatManaCost(card.manaCost)}
                </span>
              </div>
            )}

            {/* Type line */}
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--status-neutral)] border-b border-[var(--grid-line)] pb-2">
              {card.typeLine}
            </p>

            {/* Oracle text */}
            {card.oracleText && (
              <div className="mt-3">
                <p className="font-mono text-sm text-[var(--lumon-black)] leading-relaxed whitespace-pre-line">
                  {formatOracleText(card.oracleText)}
                </p>
              </div>
            )}

            {/* Categories */}
            {card.categories && card.categories.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[var(--grid-line)]">
                <span className="text-terminal text-[var(--status-neutral)]">CATEGORY: </span>
                <span className="font-mono text-xs text-[var(--lumon-black)]">
                  {card.categories.join(', ')}
                </span>
              </div>
            )}

            {/* Set info */}
            <div className="mt-2">
              <span className="text-terminal text-[var(--status-neutral)]">SET: </span>
              <span className="font-mono text-xs text-[var(--lumon-black)] uppercase">
                {card.setCode}
              </span>
            </div>

            {/* CMC */}
            <div className="mt-1">
              <span className="text-terminal text-[var(--status-neutral)]">CMC: </span>
              <span className="font-mono text-xs text-[var(--lumon-black)]">
                {card.cmc}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
