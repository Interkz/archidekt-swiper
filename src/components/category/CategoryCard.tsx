import type { NormalizedCard } from '../../types/archidekt'
import { getCardImageUrl } from '../../services/scryfallImages'
import { useFavoritesStore } from '../../stores/favoritesStore'

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
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const favorited = isFavorite(card.id)

  return (
    <div className="relative flex-shrink-0 w-24">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`w-full overflow-hidden transition-all duration-150 bg-[var(--surface-primary)] border
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
        <img
          src={getCardImageUrl(card.scryfallId, 'small')}
          alt={card.name}
          className="w-full h-auto"
          draggable={false}
        />
        <p className="font-mono text-[10px] text-center text-[var(--lumon-black)] truncate px-1.5 py-1.5 bg-[var(--surface-primary)] border-t border-[var(--grid-line)]">
          {card.name}
        </p>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite(card)
        }}
        className="absolute top-1 right-1 z-10 w-5 h-5 flex items-center justify-center
                   border border-[var(--lumon-black)] bg-[var(--lumon-white)]/90
                   hover:bg-[var(--lumon-white)] transition-all duration-150"
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-3 h-3 transition-colors duration-150 ${
            favorited ? 'text-[var(--lumon-green)] fill-[var(--lumon-green)]' : 'text-[var(--lumon-black)] fill-transparent'
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="square" strokeLinejoin="miter" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  )
}
