import type { NormalizedCard } from '../../types/archidekt'
import { getCardImageUrl } from '../../services/scryfallImages'

interface CategoryCardProps {
  card: NormalizedCard
  note?: string
  isFocused: boolean
  isDisabled?: boolean
  onClick: () => void
  onNoteClick?: () => void
}

export default function CategoryCard({
  card,
  note,
  isFocused,
  isDisabled,
  onClick,
  onNoteClick,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`group flex-shrink-0 w-24 overflow-hidden transition-all duration-150 bg-[var(--surface-primary)] border
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
        {/* Note icon */}
        {onNoteClick && (
          <button
            onClick={(e) => { e.stopPropagation(); onNoteClick() }}
            className={`absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center transition-all duration-150
                       ${note
                         ? 'bg-[var(--lumon-green)] text-[var(--lumon-white)]'
                         : 'bg-[var(--surface-primary)]/80 text-[var(--lumon-black)]/50 opacity-0 group-hover:opacity-100'
                       }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        {/* Note label */}
        {note && (
          <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-[var(--lumon-black)]/85">
            <p className="font-mono text-[8px] text-[var(--lumon-white)] truncate">{note}</p>
          </div>
        )}
      </div>
      <p className="font-mono text-[10px] text-center text-[var(--lumon-black)] truncate px-1.5 py-1.5 bg-[var(--surface-primary)] border-t border-[var(--grid-line)]">
        {card.name}
      </p>
    </button>
  )
}
