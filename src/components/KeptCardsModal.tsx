import { useDeckStore } from '../stores/deckStore'
import { getCardImageUrl } from '../services/scryfallImages'
import type { NormalizedCard } from '../types/archidekt'

interface KeptCardsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function KeptCardsModal({ isOpen, onClose }: KeptCardsModalProps) {
  const { keptCards, getUniqueCategories, getCategoryKeptCards } = useDeckStore()

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            Kept Cards ({keptCards.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {keptCards.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No cards kept yet</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(cardsByCategory).map(([category, cards]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-purple-400 mb-2">
                    {category} ({cards.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                      >
                        <img
                          src={getCardImageUrl(card.scryfallId, 'small')}
                          alt={card.name}
                          className="w-8 h-11 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{card.name}</p>
                          {card.quantity > 1 && (
                            <p className="text-xs text-gray-400">x{card.quantity}</p>
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
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
