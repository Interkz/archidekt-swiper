import { useDeckStore } from '../stores/deckStore'
import { getCardImageUrl } from '../services/scryfallImages'
import type { NormalizedCard } from '../types/archidekt'

interface KeptCardsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function KeptCardsModal({ isOpen, onClose }: KeptCardsModalProps) {
  const { keptCards, cardNotes, getUniqueCategories, getCategoryKeptCards } = useDeckStore()

  if (!isOpen) return null

  const categories = getUniqueCategories()

  // Group kept cards by category
  const cardsByCategory: Record<string, NormalizedCard[]> = {}
  categories.forEach((category) => {
    const cards = getCategoryKeptCards(category)
    if (cards.length > 0) {
      cardsByCategory[category] = cards
    }
  })

  // Find cards without categories
  const uncategorizedCards = keptCards.filter(
    (card) => !card.categories || card.categories.length === 0
  )
  if (uncategorizedCards.length > 0) {
    cardsByCategory['Uncategorized'] = uncategorizedCards
  }

  // Format count with leading zeros
  const formatCount = (n: number) => n.toString().padStart(3, '0')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative modal-content max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-[var(--lumon-black)]">
          <div>
            <span className="text-terminal text-[var(--status-neutral)]">RETAINED INVENTORY</span>
            <h2 className="font-mono text-lg font-bold text-[var(--lumon-black)] mt-1">
              {formatCount(keptCards.length)} CARDS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border-2 border-[var(--lumon-black)] flex items-center justify-center text-[var(--lumon-black)]
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-[var(--surface-elevated)]">
          {keptCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-2 border-[var(--grid-line)] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[var(--status-neutral)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-terminal text-[var(--status-neutral)]">NO CARDS RETAINED</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(cardsByCategory).map(([category, cards]) => (
                <div key={category}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--grid-line)]">
                    <span className="text-terminal text-[var(--lumon-green)]">// {category.toUpperCase()}</span>
                    <span className="font-mono text-xs text-[var(--status-neutral)]">({cards.length})</span>
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center gap-3 p-2 border border-[var(--grid-line)] bg-[var(--surface-primary)]
                                   hover:border-[var(--lumon-green)] transition-colors duration-150"
                      >
                        <img
                          src={getCardImageUrl(card.scryfallId, 'small')}
                          alt={card.name}
                          className="w-8 h-11 object-cover border border-[var(--grid-line)]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs text-[var(--lumon-black)] truncate">{card.name}</p>
                          {card.quantity > 1 && (
                            <p className="font-mono text-xs text-[var(--status-neutral)]">x{card.quantity}</p>
                          )}
                          {cardNotes[card.id] && (
                            <p className="font-mono text-[10px] text-[var(--lumon-green)] truncate">
                              {cardNotes[card.id]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[var(--lumon-black)]">
          <button
            onClick={onClose}
            className="w-full py-3 border-2 border-[var(--lumon-black)] font-mono font-semibold uppercase tracking-wider
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            Close Inventory
          </button>
        </div>
      </div>
    </div>
  )
}
