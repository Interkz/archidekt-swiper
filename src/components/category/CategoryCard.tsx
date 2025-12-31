import type { NormalizedCard } from '../../types/archidekt'
import { getCardImageUrl } from '../../services/scryfallImages'

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
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex-shrink-0 w-24 rounded-lg overflow-hidden transition-all
        ${isFocused ? 'ring-2 ring-purple-500 scale-105' : ''}
        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-102 cursor-pointer'}
      `}
    >
      <img
        src={getCardImageUrl(card.scryfallId, 'small')}
        alt={card.name}
        className="w-full h-auto"
        draggable={false}
      />
      <p className="text-xs text-center text-white truncate px-1 py-1 bg-black/50">
        {card.name}
      </p>
    </button>
  )
}
