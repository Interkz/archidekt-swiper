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
  const bgClass = isKept ? 'bg-emerald-50/50' : 'bg-slate-50'
  const borderClass = isActiveSection ? 'border-violet-400 shadow-sm' : 'border-slate-200'

  return (
    <div className={`rounded-2xl border-2 ${borderClass} ${bgClass} p-4 transition-all duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${isKept ? 'text-emerald-600' : 'text-slate-600'}`}>
          {title} ({cards.length})
        </h3>
        {isActiveSection && (
          <span className="text-xs font-medium text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
            {isKept ? '↓ to remove' : '↑ to keep'}
          </span>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="h-36 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">
              {isKept ? 'No cards kept yet' : 'All cards in this category are kept'}
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
