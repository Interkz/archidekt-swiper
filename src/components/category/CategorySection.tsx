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
  const bgClass = isKept ? 'bg-green-900/20' : 'bg-gray-800/50'
  const borderClass = isActiveSection ? 'border-purple-500' : 'border-transparent'

  return (
    <div className={`rounded-lg border-2 ${borderClass} ${bgClass} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-semibold ${isKept ? 'text-green-400' : 'text-gray-400'}`}>
          {title} ({cards.length})
        </h3>
        {isActiveSection && (
          <span className="text-xs text-purple-400">
            {isKept ? '↓ to remove' : '↑ to keep'}
          </span>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="h-36 flex items-center justify-center text-gray-500 text-sm">
          {isKept ? 'No cards kept yet' : 'All cards in this category are kept'}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600"
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
