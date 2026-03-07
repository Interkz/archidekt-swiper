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
      className={`flex-shrink-0 w-24 overflow-hidden transition-all duration-150 bg-[var(--surface-primary)] border
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
      <div className="px-1.5 py-1 bg-[var(--surface-primary)] border-t border-[var(--grid-line)]">
        <p className="font-mono text-[10px] text-center text-[var(--lumon-black)] truncate">
          {card.name}
        </p>
        <p
          className="font-mono text-[9px] text-center font-bold"
          style={{
            color: card.price == null ? 'var(--status-neutral)' : card.price < 1 ? 'var(--lumon-green)' : card.price <= 5 ? '#b8860b' : '#8b0000',
          }}
        >
          {card.price != null ? `$${card.price.toFixed(2)}` : 'N/A'}
        </p>
      </div>
    </button>
  )
}
