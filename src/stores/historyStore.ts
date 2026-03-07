import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReviewHistoryEntry, CardDecision } from '../types/archidekt'

interface HistoryState {
  reviews: ReviewHistoryEntry[]
  addReview: (review: Omit<ReviewHistoryEntry, 'id' | 'date'>) => void
  clearHistory: () => void
  getReview: (id: string) => ReviewHistoryEntry | undefined
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) => {
        const entry: ReviewHistoryEntry = {
          ...review,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        }
        set((state) => ({
          reviews: [entry, ...state.reviews],
        }))
      },

      clearHistory: () => set({ reviews: [] }),

      getReview: (id) => {
        return get().reviews.find((r) => r.id === id)
      },
    }),
    {
      name: 'archidekt-swiper-history',
    }
  )
)

export function buildDecisions(
  keptCards: { name: string; categories: string[] }[],
  removedCards: { name: string; categories: string[] }[],
  maybeCards: { name: string; categories: string[] }[]
): CardDecision[] {
  const decisions: CardDecision[] = []

  for (const card of keptCards) {
    decisions.push({
      cardName: card.name,
      action: 'keep',
      category: card.categories[0] || 'Uncategorized',
    })
  }
  for (const card of removedCards) {
    decisions.push({
      cardName: card.name,
      action: 'remove',
      category: card.categories[0] || 'Uncategorized',
    })
  }
  for (const card of maybeCards) {
    decisions.push({
      cardName: card.name,
      action: 'maybe',
      category: card.categories[0] || 'Uncategorized',
    })
  }

  return decisions
}
