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
      className={`flex-shrink-0 w-24 rounded-xl overflow-hidden transition-all duration-200 bg-white card-shadow
        ${isFocused ? 'ring-2 ring-violet-500 ring-offset-2 scale-105' : ''}
        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
      `}
    >
      <img
        src={getCardImageUrl(card.scryfallId, 'small')}
        alt={card.name}
        className="w-full h-auto"
        draggable={false}
      />
      <p className="text-xs text-center text-slate-700 truncate px-1.5 py-1.5 bg-white font-medium">
        {card.name}
      </p>
    </button>
  )
}
