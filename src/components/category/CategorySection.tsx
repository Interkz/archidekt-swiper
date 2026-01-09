import { useRef, useEffect } from 'react'
import type { NormalizedCard } from '../../types/archidekt'
import CategoryCard from './CategoryCard'

interface CategorySectionProps {
  title: 'Kept' | 'Available'
  cards: NormalizedCard[]
  isActiveSection: boolean
  activeCardIndex: number
  onCardClick: (card: NormalizedCard, index: number) => void
  limitReached?: boolean
}

export default function CategorySection({
  title,
  cards,
  isActiveSection,
  activeCardIndex,
  onCardClick,
  limitReached,
}: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Auto-scroll to focused card
  useEffect(() => {
    if (isActiveSection && cardRefs.current[activeCardIndex]) {
      cardRefs.current[activeCardIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [isActiveSection, activeCardIndex])

  const isKept = title === 'Kept'

  return (
    <div className={`border-2 p-4 transition-all duration-150
      ${isActiveSection
        ? 'border-[var(--lumon-green)]'
        : 'border-[var(--grid-line)]'
      }
      ${isKept ? 'bg-[var(--lumon-green-pale)]/30' : 'bg-[var(--surface-elevated)]'}
    `}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--grid-line)]">
        <div className="flex items-center gap-2">
          <span className={`text-terminal ${isKept ? 'text-[var(--lumon-green)]' : 'text-[var(--status-neutral)]'}`}>
            // {title.toUpperCase()}
          </span>
          <span className="font-mono text-xs text-[var(--status-neutral)]">
            ({cards.length})
          </span>
        </div>
        {isActiveSection && (
          <span className="font-mono text-xs text-[var(--lumon-green)] border border-[var(--lumon-green)] px-2 py-1">
            {isKept ? '↓ REJECT' : '↑ ACCEPT'}
          </span>
        )}
      </div>

      {/* Cards list */}
      {cards.length === 0 ? (
        <div className="h-32 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border border-[var(--grid-line)] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[var(--status-neutral)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-terminal text-[var(--status-neutral)]">
              {isKept ? 'NO CARDS RETAINED' : 'ALL CARDS RETAINED'}
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2"
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[index] = el }}
            >
              <CategoryCard
                card={card}
                isFocused={isActiveSection && index === activeCardIndex}
                isDisabled={!isKept && limitReached}
                onClick={() => onCardClick(card, index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
