import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavoritesStore } from '../stores/favoritesStore'
import { getCardImageUrl } from '../services/scryfallImages'

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore()
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    if (confirmClear) {
      clearFavorites()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-[var(--lumon-black)] p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--status-neutral)]
                       hover:text-[var(--lumon-black)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <span className="text-terminal text-[var(--lumon-green)]">
            FAVORITES ({favorites.length.toString().padStart(3, '0')})
          </span>
        </div>
      </header>

      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {/* Title section */}
        <div className="mb-6 pb-4 border-b border-[var(--grid-line)]">
          <span className="text-terminal text-[var(--status-neutral)]">SAVED CARDS</span>
          <div className="flex items-center justify-between mt-2">
            <p className="font-mono text-sm text-[var(--status-neutral)]">
              {favorites.length === 0
                ? 'No favorites yet. Heart cards while swiping to save them here.'
                : `${favorites.length} card${favorites.length !== 1 ? 's' : ''} saved across all sessions`}
            </p>
            {favorites.length > 0 && (
              <button
                onClick={handleClear}
                onBlur={() => setConfirmClear(false)}
                className={`px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider border-2 transition-all duration-150
                  ${confirmClear
                    ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)] border-[var(--lumon-black)]'
                    : 'border-[var(--lumon-black)] hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)]'
                  }`}
              >
                {confirmClear ? 'Confirm Clear' : 'Clear All'}
              </button>
            )}
          </div>
        </div>

        {/* Favorites grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--grid-line)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--grid-line)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="text-terminal text-[var(--status-neutral)] tracking-widest">
              NO FAVORITES YET
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map((card) => (
              <div key={card.id} className="relative group">
                <div className="overflow-hidden border border-[var(--grid-line)] bg-[var(--surface-primary)]
                                hover:border-[var(--lumon-black)] transition-all duration-150">
                  <img
                    src={getCardImageUrl(card.scryfallId, 'normal')}
                    alt={card.name}
                    className="w-full h-auto"
                    draggable={false}
                  />
                  <div className="px-2 py-2 border-t border-[var(--grid-line)]">
                    <p className="font-mono text-[10px] text-[var(--lumon-black)] truncate">
                      {card.name}
                    </p>
                    <p className="font-mono text-[9px] text-[var(--status-neutral)] truncate">
                      {card.typeLine}
                    </p>
                  </div>
                </div>
                {/* Remove button */}
                <button
                  onClick={() => removeFavorite(card.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center
                             border border-[var(--lumon-black)] bg-[var(--lumon-white)]/90
                             opacity-0 group-hover:opacity-100 transition-opacity duration-150
                             hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)]"
                  aria-label="Remove from favorites"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
