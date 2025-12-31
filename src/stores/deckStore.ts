import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  ArchidektDeckResponse,
  ArchidektCardEntry,
  NormalizedCard,
  SwipeAction,
  ViewMode,
  CategorySection,
} from '../types/archidekt'

type SwipeMode = 'main' | 'sideboard'

interface DeckState {
  // Deck metadata
  deckId: string | null
  deckName: string
  deckOwner: string

  // Main deck card lists
  allCards: NormalizedCard[]
  remainingCards: NormalizedCard[]
  keptCards: NormalizedCard[]
  removedCards: NormalizedCard[]

  // Sideboard card lists
  allSideboardCards: NormalizedCard[]
  remainingSideboardCards: NormalizedCard[]

  // Swipe history for undo
  swipeHistory: SwipeAction[]

  // UI State
  isLoading: boolean
  error: string | null
  swipeMode: SwipeMode

  // View mode (swipe vs category)
  viewMode: ViewMode

  // Category mode state
  categoryLimits: Record<string, number>
  activeCategoryIndex: number
  activeSection: CategorySection
  activeCardIndex: number

  // Actions
  setDeck: (deck: ArchidektDeckResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSwipeMode: (mode: SwipeMode) => void
  keepCard: (card: NormalizedCard) => void
  removeCard: (card: NormalizedCard) => void
  undoLastSwipe: () => NormalizedCard | null
  resetDeck: () => void
  clearState: () => void

  // View mode actions
  setViewMode: (mode: ViewMode) => void

  // Category mode actions
  setCategoryLimit: (category: string, limit: number) => void
  setActiveCategoryIndex: (index: number) => void
  setActiveSection: (section: CategorySection) => void
  setActiveCardIndex: (index: number) => void
  addCardToKept: (card: NormalizedCard) => void
  removeCardFromKept: (card: NormalizedCard) => void

  // Category mode selectors (computed)
  getUniqueCategories: () => string[]
  getCategoryKeptCards: (category: string) => NormalizedCard[]
  getCategoryAvailableCards: (category: string) => NormalizedCard[]
  canAddToCategory: (category: string) => boolean
}

function normalizeCards(cards: ArchidektCardEntry[], includeSideboard: boolean = false): NormalizedCard[] {
  return cards
    .filter((entry) => {
      const isSideboard = entry.categories.some(
        (cat) => cat.toLowerCase() === 'sideboard'
      )
      const isMaybeboard = entry.categories.some(
        (cat) => cat.toLowerCase() === 'maybeboard'
      )

      if (includeSideboard) {
        return isSideboard
      } else {
        // Main deck: exclude maybeboard and sideboard
        return !isMaybeboard && !isSideboard
      }
    })
    .map((entry) => ({
      id: entry.card.uid,
      name: entry.card.oracleCard.name,
      manaCost: entry.card.oracleCard.manaCost || '',
      cmc: entry.card.oracleCard.cmc,
      typeLine: entry.card.oracleCard.typeLine,
      scryfallId: entry.card.uid,
      quantity: entry.quantity,
      categories: entry.categories,
      setCode: entry.card.edition.editioncode,
    }))
    .sort((a, b) => {
      // Sort by CMC, then alphabetically
      if (a.cmc !== b.cmc) return a.cmc - b.cmc
      return a.name.localeCompare(b.name)
    })
}

export const useDeckStore = create<DeckState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        deckId: null,
        deckName: '',
        deckOwner: '',
        allCards: [],
        remainingCards: [],
        keptCards: [],
        removedCards: [],
        allSideboardCards: [],
        remainingSideboardCards: [],
        swipeHistory: [],
        isLoading: false,
        error: null,
        swipeMode: 'main' as SwipeMode,

        // View mode state
        viewMode: 'swipe' as ViewMode,

        // Category mode state
        categoryLimits: {} as Record<string, number>,
        activeCategoryIndex: 0,
        activeSection: 'available' as CategorySection,
        activeCardIndex: 0,

        setDeck: (deck) => {
          const mainDeck = normalizeCards(deck.cards, false)
          const sideboard = normalizeCards(deck.cards, true)
          set({
            deckId: String(deck.id),
            deckName: deck.name,
            deckOwner: deck.owner.username,
            allCards: mainDeck,
            remainingCards: [...mainDeck],
            keptCards: [],
            removedCards: [],
            allSideboardCards: sideboard,
            remainingSideboardCards: [...sideboard],
            swipeHistory: [],
            error: null,
            swipeMode: 'main',
            viewMode: 'swipe',
            categoryLimits: {},
            activeCategoryIndex: 0,
            activeSection: 'available',
            activeCardIndex: 0,
          })
        },

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        setSwipeMode: (mode) => set({ swipeMode: mode }),

        // View mode actions
        setViewMode: (mode) => set({ viewMode: mode }),

        // Category mode actions
        setCategoryLimit: (category, limit) => {
          const { categoryLimits } = get()
          set({
            categoryLimits: { ...categoryLimits, [category]: limit },
          })
        },

        setActiveCategoryIndex: (index) => set({ activeCategoryIndex: index, activeCardIndex: 0 }),

        setActiveSection: (section) => set({ activeSection: section, activeCardIndex: 0 }),

        setActiveCardIndex: (index) => set({ activeCardIndex: index }),

        addCardToKept: (card) => {
          const { keptCards, remainingCards } = get()
          // Only add if not already kept
          if (!keptCards.some((c) => c.id === card.id)) {
            set({
              keptCards: [...keptCards, card],
              remainingCards: remainingCards.filter((c) => c.id !== card.id),
            })
          }
        },

        removeCardFromKept: (card) => {
          const { keptCards, remainingCards, allCards } = get()
          // Only remove if currently kept
          if (keptCards.some((c) => c.id === card.id)) {
            // Check if card is in original allCards (not from sideboard)
            const isMainDeckCard = allCards.some((c) => c.id === card.id)
            set({
              keptCards: keptCards.filter((c) => c.id !== card.id),
              remainingCards: isMainDeckCard ? [...remainingCards, card] : remainingCards,
            })
          }
        },

        // Category mode selectors
        getUniqueCategories: () => {
          const { allCards } = get()
          const categorySet = new Set<string>()

          allCards.forEach((card) => {
            card.categories.forEach((cat) => {
              const lowerCat = cat.toLowerCase()
              if (!['sideboard', 'maybeboard'].includes(lowerCat)) {
                categorySet.add(cat)
              }
            })
          })

          // Sort alphabetically but put Commander first
          return Array.from(categorySet).sort((a, b) => {
            if (a.toLowerCase() === 'commander') return -1
            if (b.toLowerCase() === 'commander') return 1
            return a.localeCompare(b)
          })
        },

        getCategoryKeptCards: (category) => {
          const { keptCards } = get()
          return keptCards.filter((card) =>
            card.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
          )
        },

        getCategoryAvailableCards: (category) => {
          const { allCards, keptCards } = get()
          const keptIds = new Set(keptCards.map((c) => c.id))
          return allCards.filter(
            (card) =>
              card.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()) &&
              !keptIds.has(card.id)
          )
        },

        canAddToCategory: (category) => {
          const { categoryLimits } = get()
          const limit = categoryLimits[category]
          if (limit === undefined || limit === 0) return true // No limit set
          const keptCount = get().getCategoryKeptCards(category).length
          return keptCount < limit
        },

        keepCard: (card) => {
          const { remainingCards, remainingSideboardCards, keptCards, swipeHistory, swipeMode } = get()

          if (swipeMode === 'sideboard') {
            // Swiping right on sideboard card adds it to kept (mainboard)
            set({
              remainingSideboardCards: remainingSideboardCards.filter((c) => c.id !== card.id),
              keptCards: [...keptCards, card],
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'keep', timestamp: Date.now(), fromSideboard: true },
              ],
            })
          } else {
            set({
              remainingCards: remainingCards.filter((c) => c.id !== card.id),
              keptCards: [...keptCards, card],
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'keep', timestamp: Date.now(), fromSideboard: false },
              ],
            })
          }
        },

        removeCard: (card) => {
          const { remainingCards, remainingSideboardCards, removedCards, swipeHistory, swipeMode } = get()

          if (swipeMode === 'sideboard') {
            // Swiping left on sideboard card just skips it (doesn't add to mainboard)
            set({
              remainingSideboardCards: remainingSideboardCards.filter((c) => c.id !== card.id),
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'remove', timestamp: Date.now(), fromSideboard: true },
              ],
            })
          } else {
            set({
              remainingCards: remainingCards.filter((c) => c.id !== card.id),
              removedCards: [...removedCards, card],
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'remove', timestamp: Date.now(), fromSideboard: false },
              ],
            })
          }
        },

        undoLastSwipe: () => {
          const { swipeHistory, keptCards, removedCards, remainingCards, remainingSideboardCards } = get()
          if (swipeHistory.length === 0) return null

          const lastAction = swipeHistory[swipeHistory.length - 1]
          const newHistory = swipeHistory.slice(0, -1)
          const fromSideboard = (lastAction as SwipeAction & { fromSideboard?: boolean }).fromSideboard

          if (fromSideboard) {
            // Restore to sideboard
            if (lastAction.action === 'keep') {
              set({
                keptCards: keptCards.filter((c) => c.id !== lastAction.card.id),
                remainingSideboardCards: [lastAction.card, ...remainingSideboardCards],
                swipeHistory: newHistory,
              })
            } else {
              set({
                remainingSideboardCards: [lastAction.card, ...remainingSideboardCards],
                swipeHistory: newHistory,
              })
            }
          } else {
            // Restore to main deck
            if (lastAction.action === 'keep') {
              set({
                keptCards: keptCards.filter((c) => c.id !== lastAction.card.id),
                remainingCards: [lastAction.card, ...remainingCards],
                swipeHistory: newHistory,
              })
            } else {
              set({
                removedCards: removedCards.filter((c) => c.id !== lastAction.card.id),
                remainingCards: [lastAction.card, ...remainingCards],
                swipeHistory: newHistory,
              })
            }
          }

          return lastAction.card
        },

        resetDeck: () => {
          const { allCards, allSideboardCards } = get()
          set({
            remainingCards: [...allCards],
            remainingSideboardCards: [...allSideboardCards],
            keptCards: [],
            removedCards: [],
            swipeHistory: [],
            swipeMode: 'main',
            viewMode: 'swipe',
            categoryLimits: {},
            activeCategoryIndex: 0,
            activeSection: 'available',
            activeCardIndex: 0,
          })
        },

        clearState: () => {
          set({
            deckId: null,
            deckName: '',
            deckOwner: '',
            allCards: [],
            remainingCards: [],
            keptCards: [],
            removedCards: [],
            allSideboardCards: [],
            remainingSideboardCards: [],
            swipeHistory: [],
            isLoading: false,
            error: null,
            swipeMode: 'main',
            viewMode: 'swipe',
            categoryLimits: {},
            activeCategoryIndex: 0,
            activeSection: 'available',
            activeCardIndex: 0,
          })
        },
      }),
      {
        name: 'archidekt-swiper-storage',
        partialize: (state) => ({
          deckId: state.deckId,
          deckName: state.deckName,
          deckOwner: state.deckOwner,
          keptCards: state.keptCards,
          removedCards: state.removedCards,
          remainingCards: state.remainingCards,
          allCards: state.allCards,
          allSideboardCards: state.allSideboardCards,
          remainingSideboardCards: state.remainingSideboardCards,
          swipeHistory: state.swipeHistory,
          swipeMode: state.swipeMode,
          viewMode: state.viewMode,
          categoryLimits: state.categoryLimits,
        }),
      }
    )
  )
)
