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
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col card-shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Kept Cards ({keptCards.length})
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {keptCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-500">No cards kept yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(cardsByCategory).map(([category, cards]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-violet-600 mb-3">
                    {category} ({cards.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        <img
                          src={getCardImageUrl(card.scryfallId, 'small')}
                          alt={card.name}
                          className="w-8 h-11 object-cover rounded-md shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 truncate font-medium">{card.name}</p>
                          {card.quantity > 1 && (
                            <p className="text-xs text-slate-500">x{card.quantity}</p>
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
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium text-white transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
